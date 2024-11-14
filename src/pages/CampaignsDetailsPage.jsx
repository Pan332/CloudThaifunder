import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './CampaignsDetailsPage.css';

function CampaignsDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const port = import.meta.env.VITE_API_URL;
  const [campaign, setCampaign] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch campaign details
  useEffect(() => {
    fetch(`${port}/api/CampaignById/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch campaign details');
        return response.json();
      })
      .then(data => {
        if (data.success) setCampaign(data.data);
        else setError(data.message || 'Failed to load campaign details');
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [port, id]);
  // Calculate time remaining for campaign
  const calculateTimeRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate - now;
    return timeDifference > 0
      ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} days left`
      : "Campaign ended";
  };

  // Fetch comments without authentication
  const fetchComments = async () => {
    try {
      const response = await fetch(`${port}/comment/GetComment/${id}`);
      const commentsData = await response.json();
      if (commentsData.success) {
        setComments(commentsData.comments);
      } else {
        setError('Failed to load comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('An error occurred while fetching comments.');
    } finally {
      setCommentsLoading(false);
    }
  };
  console.log(campaign)
  useEffect(() => {
    fetchComments();
  }, [id]);

  // Handle comment submission, requires authentication
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('You are not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${port}/comment/AddComment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: id,
          comment_text: commentText,
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      if (data.success) {
        setComments([{ commentText: commentText, timestamp: new Date().toISOString(), firstName: 'You' }, ...comments]);
        setCommentText(''); // Clear the input field
        setSuccess('Comment added successfully!');
      } else {
        setError(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('An error occurred while adding the comment.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="details-page">
        {loading && <p>Loading campaign details...</p>}
        {error && <p className="error-message">{error}</p>}
        {campaign && !loading && !error && (
          <div className="campaign-details">
            <div className="image-section">
              <h1>{campaign.title}</h1>
              <img
        src={`${port}/${campaign.image}`}
          alt={campaign.title}
           className="campaign-images"
                  />
            </div>

            <div className="info-section">
              <div className="stats">
                <p><strong>Goal Amount:</strong> ${campaign.goal_amount}</p>
                <p><strong>Raised Amount:</strong> ${campaign.raised_amount}</p>
                <p><strong>Time Remaining:</strong> {calculateTimeRemaining(campaign.deadline)}</p>
              </div>

              <div className="description">
                <h2>Description</h2>
                <p dangerouslySetInnerHTML={{ __html: campaign.description }}></p>
                </div>

              <div className="donation-section">
                <button className="donate-button">Donate Now</button>
              </div>
          

              <div className="comments-section">
                <h2>Comments</h2>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  required
                />
                <button type="submit">Post Comment</button>
              </form>
                {commentsLoading ? (
                  <p>Loading comments...</p>
                ) : (
                  comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <p><strong>{comment.firstName || 'Anonymous'}</strong> </p>
                        <p>{comment.commentText}</p>
                        <p><small>{new Date(comment.timestamp).toLocaleString()}</small></p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CampaignsDetailsPage;
