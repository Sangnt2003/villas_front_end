export const generateStarElements = (rating, maxStars = 5) => (
    Array.from({ length: maxStars }, (_, index) => (
        <i
            key={index}
            className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
        />
    ))
);
