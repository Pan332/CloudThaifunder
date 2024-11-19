import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './CampaignsDetailsPage.css';
import QRCodeGenerator from '../components/SlipandQRmodal.jsx';

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
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const isLoggedIn = !!localStorage.getItem('access_token');
    const [currentUserId, setCurrentUserId] = useState(null); // Store current user's ID

    const toggleDonateModal = () => setShowDonateModal(!showDonateModal);
    
    useEffect(() => {
      const fetchCampaign = async () => {
          try {
              const response = await fetch(`${port}/view/CampaignById/${id}`);
              if (!response.ok) {
                  // ตรวจสอบ response code
                  const text = await response.text(); // อ่าน response เป็น text
                  throw new Error(`Failed to fetch campaign details: ${response.status} - ${text}`);
              }
              const data = await response.json();
              if (data.success) {
                  setCampaign(data.data);
              } else {
                  setError(data.message || 'Failed to load campaign details');
              }
          } catch (error) {
              setError(error.message); // แสดง error message ที่ละเอียดขึ้น
          } finally {
              setLoading(false);
          }
      };

      const fetchUserInfo = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
    
        try {
            const response = await fetch(`${port}/auth/validate`, { 
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to validate user');
            const data = await response.json();
            if (data.success) {
                console.log(data.user_id); 
                setCurrentUserId(data.user_id);

            } else {
                setError('User validation failed.');
            }
        } catch (error) {
            setError('An error occurred while validating the user.');
        }
    };
    
        fetchCampaign();
        fetchUserInfo(); 

    }, [port, id]);
    


    useEffect(() => {
      const fetchComments = async () => {
          try {
              const response = await fetch(`${port}/comment/GetComment/${id}`);
              if (!response.ok) {
                  // ตรวจสอบ response code
                  const text = await response.text(); // อ่าน response เป็น text
                  throw new Error(`Failed to fetch comments: ${response.status} - ${text}`);
              }
              const commentsData = await response.json();
              if (commentsData.success) {
                  setComments(commentsData.comments);

              } else {
                  setError('Failed to load comments');
              }
          } catch (error) {
              setError(error.message); // แสดง error message ที่ละเอียดขึ้น
          } finally {
              setCommentsLoading(false);
          }
      };

      fetchComments();
  }, [port, id]);

    const calculateTimeRemaining = (deadline) => {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        const timeDifference = deadlineDate - now;
        return timeDifference > 0
            ? `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} days left`
            : 'Campaign ended';
    };

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
                    Authorization: `Bearer ${token}`,
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
                setComments([{ commentText, firstName: 'You', timestamp: new Date().toISOString() }, ...comments]);
                setCommentText('');
                setSuccess('Comment added successfully!');
            } else {
                setError(data.message || 'Failed to add comment');
            }
        } catch (error) {
            setError('An error occurred while adding the comment.');
        }
    };

    const handleCommentEdit = (commentId) => {
        setEditingCommentId(commentId);
        const comment = comments.find((c) => c.commentId === commentId);
        setEditedText(comment.commentText);
    };

    const handleCommentSaveEdit = async (commentId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('You are not authenticated. Please log in.');
            return;
        }

        try {
            const response = await fetch(`${port}/comment/EditComment/${commentId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment_text: editedText }),
            });

            if (!response.ok) throw new Error('Failed to edit comment');

            const data = await response.json();
            if (data.success) {
                setComments(
                    comments.map((comment) =>
                        comment.commentId === commentId ? { ...comment, commentText: editedText } : comment
                    )
                );
                setEditingCommentId(null);
                setEditedText('');
                setSuccess('Comment updated successfully!');
            } else {
                setError(data.message || 'Failed to update comment');
            }
        } catch (error) {
            setError('An error occurred while editing the comment.');
        }
    };

    const handleCommentDelete = async (commentId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('You are not authenticated. Please log in.');
            return;
        }

        try {
            const response = await fetch(`${port}/comment/DeleteComment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete comment');

            const data = await response.json();
            if (data.success) {
                setComments(comments.filter((comment) => comment.commentId !== commentId));
                setSuccess('Comment deleted successfully!');
            } else {
                setError(data.message || 'Failed to delete comment');
            }
        } catch (error) {
            setError('An error occurred while deleting the comment.');
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
                                <p><strong>Goal Amount:</strong> {campaign.goal_amount}฿</p>
                                <p><strong>Raised Amount:</strong> {campaign.raised_amount}฿</p>
                                <p><strong>Time Remaining:</strong> {calculateTimeRemaining(campaign.deadline)}</p>
                            </div>

                            <div className="description">
                                <h2>Description</h2>
                                <p dangerouslySetInnerHTML={{ __html: campaign.description }}></p>
                            </div>

                            <div className="donation-section">
                                <button className="donate-button" onClick={toggleDonateModal}>Donate Now</button>
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
                                                    { editingCommentId === comment.commentId ? (
                                                        <div>
                                                            <textarea
                                                                value={editedText}
                                                                onChange={(e) => setEditedText(e.target.value)}
                                                            />
                                                            <button onClick={() => handleCommentSaveEdit(comment.commentId)}>Save</button>
                                                        </div>
                                                    ) :isLoggedIn && comment.userId === currentUserId && (
                                                        <>
                                                            <div className="buttons-container">
                                                                <button className="edit" onClick={() => handleCommentEdit(comment.commentId)}>Edit</button>
                                                                <button className="delete" onClick={() => handleCommentDelete(comment.commentId)}>Delete</button>
                                                            </div>
                                                        </>
                                                    )}
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

            {showDonateModal && (
                <div className="modal-overlay" onClick={toggleDonateModal}>
                    <div className="modals-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={toggleDonateModal}>X</button>
                        <h2>Donation Instructions</h2>
                        <p>Please confirm the amount you wish to donate and proceed to the QR code generation.</p>
                        <QRCodeGenerator /> {/* QR code generator component */}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default CampaignsDetailsPage;