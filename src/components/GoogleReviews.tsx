import { ExternalLink, Star } from "lucide-react";
import { googleBusinessUrl, googleReviewUrl } from "@/lib/socialProfiles";
import { googleReviewSnapshot } from "@/lib/googleReviews";

export default function GoogleReviews() {
  const snapshot = googleReviewSnapshot;

  return (
    <div className="google-reviews">
      <div className="review-summary">
        <div>
          <h2>From our Google reviews</h2>
          <p className="review-score">
            <strong>{snapshot.rating}</strong>
            <Star size={18} fill="currentColor" aria-hidden="true" />
            <span>out of 5 · {snapshot.count} reviews on Google</span>
          </p>
          <p className="review-date">
            Checked <time dateTime={snapshot.checkedAt}>{snapshot.checkedLabel}</time>
          </p>
        </div>
        <a href={googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="text-link">
          Read all on Google
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="review-grid">
        {snapshot.reviews.map((review) => (
          <figure key={review.profileUrl} className="review-card">
            <div className="review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: review.rating }, (_, i) => (
                <Star key={i} size={16} fill="currentColor" aria-hidden="true" />
              ))}
            </div>
            <blockquote>&ldquo;{review.excerpt}&rdquo;</blockquote>
            <figcaption>
              <a href={review.profileUrl} target="_blank" rel="noopener noreferrer">
                {review.author}
                <ExternalLink size={13} aria-hidden="true" />
              </a>
              <span>Google review excerpt</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="review-invitation">
        <p>Worked with Supreme? Share your honest experience.</p>
        <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="button-secondary">
          Leave a Google review
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
