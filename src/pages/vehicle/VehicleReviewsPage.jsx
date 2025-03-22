import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../components/rating/RatingStyles.css';

const VehicleReviewsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    // Fetch vehicle details and reviews
    fetchVehicleReviews(id);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const fetchVehicleReviews = (vehicleId) => {
    setLoading(true);
    
    // In a real app, this would be an API call
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock vehicle data
      const mockVehicle = {
        id: parseInt(vehicleId),
        make: 'Toyota',
        model: 'Fortuner',
        year: 2022,
        image: '/images/cars/fortuner-1.jpg',
        rating: 4.8,
        reviewCount: 27
      };
      
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          user: {
            id: 201,
            name: 'Maria Santos',
            image: '/images/users/user-1.jpg'
          },
          rating: 5,
          date: 'March 12, 2025',
          comment: 'Excellent vehicle! Very clean and well-maintained. The owner was a great host, very responsive and flexible with pickup and return. Would definitely rent again.'
        },
        {
          id: 2,
          user: {
            id: 202,
            name: 'Paolo Reyes',
            image: '/images/users/user-2.jpg'
          },
          rating: 4,
          date: 'February 28, 2025',
          comment: 'The Fortuner was perfect for our Tagaytay trip. Powerful on the hills and very comfortable. Only thing to note is that the GPS was a bit outdated, but we used our phones instead. Overall great experience.'
        },
        {
          id: 3,
          user: {
            id: 203,
            name: 'Jennifer Cruz',
            image: '/images/users/user-3.jpg'
          },
          rating: 5,
          date: 'February 15, 2025',
          comment: 'This was my first time using Drively and I couldn\'t be happier. The car was in immaculate condition and drove so smoothly. Everything was explained clearly and the owner was very accommodating with our schedule.'
        },
        {
          id: 4,
          user: {
            id: 204,
            name: 'Ricardo Lim',
            image: '/images/users/user-4.jpg'
          },
          rating: 3,
          date: 'January 30, 2025',
          comment: 'The car was good but there were a few issues with the air conditioning that made our trip a bit uncomfortable. The owner was responsive when we reported it though.'
        },
        {
          id: 5,
          user: {
            id: 205,
            name: 'Anna Rivera',
            image: '/images/users/user-5.jpg'
          },
          rating: 5,
          date: 'January 18, 2025',
          comment: 'Perfect car for our family vacation! Spacious, comfortable, and very fuel efficient. The pickup and drop-off were smooth and hassle-free. Would definitely rent again!'
        },
        {
          id: 6,
          user: {
            id: 206,
            name: 'Daniel Garcia',
            image: '/images/users/user-6.jpg'
          },
          rating: 5,
          date: 'December 26, 2024',
          comment: 'I rented this Fortuner for a week-long road trip and it exceeded all expectations. Great handling, plenty of space for luggage, and very comfortable for long drives. The owner was also very professional.'
        }
      ];
      
      setVehicle(mockVehicle);
      setReviews(mockReviews);
      setLoading(false);
    }, 1500);
  };
  
  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to complete 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  // Filter reviews based on rating
  const getFilteredReviews = () => {
    if (activeFilter === 'all') {
      return reviews;
    }
    
    const ratingFilter = parseInt(activeFilter);
    return reviews.filter(review => review.rating === ratingFilter);
  };
  
  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!reviews.length) return {};
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    return distribution;
  };
  
  // Calculate average rating
  const getAverageRating = () => {
    if (!reviews.length) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }
  
  if (!vehicle) {
    return (
      <div className="not-found-container">
        <h2>Vehicle Not Found</h2>
        <p>The vehicle you're looking for doesn't exist or has been removed.</p>
        <Link to="/search" className="btn btn-primary">Browse Other Vehicles</Link>
      </div>
    );
  }
  
  const filteredReviews = getFilteredReviews();
  const ratingDistribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className="vehicle-reviews-page">
      <div className="reviews-header">
        <div className="container">
          <div className="reviews-breadcrumb">
            <Link to={`/vehicles/${vehicle.id}`}>
              <i className="fas fa-arrow-left"></i> Back to {vehicle.year} {vehicle.make} {vehicle.model}
            </Link>
          </div>
          
          <h1 className="reviews-title">Reviews</h1>
          
          <div className="ratings-summary">
            <div className="rating-category">
              <div className="rating-number">{averageRating}</div>
              <div className="stars">
                {renderStars(parseFloat(averageRating))}
              </div>
              <div className="rating-label">{reviews.length} reviews</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="reviews-content">
        <div className="container">
          <div className="reviews-filter">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Reviews ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button 
                key={rating}
                className={`filter-btn ${activeFilter === rating.toString() ? 'active' : ''}`}
                onClick={() => setActiveFilter(rating.toString())}
              >
                {rating} Star ({ratingDistribution[rating] || 0})
              </button>
            ))}
          </div>
          
          <div className="reviews-container">
            <h2 className="reviews-list-title">
              {activeFilter === 'all' 
                ? 'All Reviews' 
                : `${activeFilter} Star Reviews (${filteredReviews.length})`}
            </h2>
            
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img 
                        src={`${process.env.PUBLIC_URL}${review.user.image}`} 
                        alt={review.user.name} 
                        className="reviewer-image" 
                      />
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{review.user.name}</h4>
                        <p className="review-date">{review.date}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No {activeFilter} star reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleReviewsPage;