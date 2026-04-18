import { Review } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, Seal } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { calculateAverageRating, getRatingDistribution } from '@/lib/reviews'

interface ReviewsSectionProps {
  reviews: Review[]
  productName: string
}

function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          weight="fill"
          className={star <= rating ? 'text-accent' : 'text-muted/30'}
        />
      ))}
    </div>
  )
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-12">
        <span className="text-sm font-medium text-foreground">{rating}</span>
        <Star size={14} weight="fill" className="text-accent" />
      </div>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const reviewDate = new Date(review.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Card className="border-border hover:border-accent/50 transition-colors duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={review.rating} size={16} />
              {review.verified && (
                <Badge variant="outline" className="gap-1 border-accent/30 bg-accent/5">
                  <Seal size={12} weight="fill" className="text-accent" />
                  <span className="text-xs">Verified Purchase</span>
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-lg text-foreground mb-1">{review.title}</h4>
          </div>
        </div>
        
        <p className="text-foreground leading-relaxed mb-4">{review.content}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="font-medium text-sm text-foreground">{review.author}</p>
            {(review.size || review.color) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {review.size && `${review.size}`}
                {review.size && review.color && ' • '}
                {review.color && `${review.color}`}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{reviewDate}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewsSection({ reviews, productName }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null
  }

  const averageRating = calculateAverageRating(reviews)
  const distribution = getRatingDistribution(reviews)

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-24"
    >
      <div className="mb-12">
        <h2 className="font-heading text-4xl font-medium text-foreground mb-3">
          Customer Reviews
        </h2>
        <p className="text-muted-foreground text-lg">
          See what our customers are saying about {productName}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <Card className="border-border bg-muted/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-heading font-medium text-foreground mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} size={24} />
                <p className="text-sm text-muted-foreground mt-3">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              <Separator className="mb-6" />

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <RatingBar
                    key={rating}
                    rating={rating}
                    count={distribution[rating as keyof typeof distribution]}
                    total={reviews.length}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {reviews.length > 3 && (
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Showing 3 of {reviews.length} reviews
          </p>
        </div>
      )}
    </motion.section>
  )
}
