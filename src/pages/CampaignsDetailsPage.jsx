import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './CampaignsDetailsPage.css';
import QRCodeGenerator from '../components/SlipandQRmodal.jsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCampaignData, setEditingCampaignData] = useState(null);
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState(''); // Fix here
    const [phone_number, setphone_number] = useState('');
    const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);
    const [donations, setDonations] = useState([]);
    const [topDonations, setTopDonations] = useState([]);

    console.log(donations)

    const handleEditClick = (campaign) => {
        setEditingCampaignData(campaign);
        setIsEditModalOpen(true);
      };
      
    
      const toggleDonateModal = () => {
        if (isLoggedIn) {
            setShowDonateModal(!showDonateModal);
        } else {
            setShowLoginPromptModal(true);
        }
    };
    
    const closeLoginPromptModal = () => {
        setShowLoginPromptModal(false);
    };
    
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
    const handleUpdateCampaign = async (editedData) => {

        try {
           
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('Unauthorized access.');

            const response = await fetch(`${port}/campaign/editCampaign/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editedData}),
            });

            if (!response.ok) throw new Error('Failed to update campaign');

            const data = await response.json();
            if (data.success) {
                setSuccess('Campaign updated successfully!');
                setIsEditModalOpen(false); // Close the modal
                setCampaign({ ...campaign, ...editedData });
            } else {
                setError(data.message || 'Failed to update campaign');
            }
        } catch (error) {
            setError(error.message);
        }
    };
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await fetch(`${port}/view/getDonationsByCampaign/${id}`);
                if (!response.ok) {
                    setDonations([]);
                    throw new Error('Failed to fetch donations');
                }
    
                const data = await response.json();
    
                if (!data.donations || data.donations.length === 0) {
                    setDonations([]);
                    return;
                }
    
                // Aggregate donations by user but show all individual donations
                const aggregatedDonations = data.donations.map(donation => {
                    // Convert the created_at date to a readable format
                    const date = new Date(donation.created_at);
                    const readableDate = date.toLocaleString('en-US', {
                        weekday: 'long', // "Monday"
                        year: 'numeric', // "2024"
                        month: 'long', // "November"
                        day: 'numeric', // "28"
                        hour: '2-digit', // "09"
                        minute: '2-digit', // "20"
                        second: '2-digit', // "55"
                        timeZoneName: 'short' // "GMT"
                    });
    
                    return {
                        firstName: donation.donor_first_name,
                        lastName: donation.donor_last_name,
                        amount: parseInt(donation.amount, 10) || 0,
                        date: readableDate, // Store the formatted date
                    };
                });
    
                setDonations(aggregatedDonations);
    
            } catch (error) {
                setError(error.message);
                setDonations([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchDonations();
    }, [id, port]);
    
    useEffect(() => {
        const fetchTopDonations = async () => {
            try {
                const response = await fetch(`${port}/view/getTopContributors/${id}`);
                if (!response.ok) {
                    setTopDonations([]);
                    throw new Error('Failed to fetch donations');
                }

                const data = await response.json();

                // If there are no donations or the data doesn't match expectations, clear the donations
                if (!data.top_contributors || data.top_contributors.length === 0) {
                    setTopDonations([]);
                    return;
                }

                // Successfully set top contributors
                setTopDonations(data.top_contributors);
            } catch (error) {
                setError(error.message);
                setTopDonations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopDonations();
    }, [id, port]);
    
    
    

    const EditModal = ({ campaign, onClose, onSave }) => {
        const [title, setLocalTitle] = useState('');
        const [short_description, setLocalShortDescription] = useState('');
        const [description, setLocalDescription] = useState('');
        const [phone_number, setLocalPhoneNumber] = useState('');
    
        useEffect(() => {
            if (campaign) {
                setLocalTitle(campaign.title || '');
                setLocalShortDescription(campaign.short_description || '');
                setLocalDescription(campaign.description || '');
                setLocalPhoneNumber(campaign.phone_number || '');
            }
        }, [campaign]);
    
        const handleSave = () => {
            // Pass the local state values to the parent onSave method
            onSave({
                title: title,
                shortDescription: short_description,
                description: description,
                phone_number: phone_number,
            });
        };
    
        return (
            <div className="modal-overlay">
                
                        
    <div className="modal-content">
    <button className="close-button" onClick={onClose}>
            &times;
        </button>
        <form
            className="modal-form"
            onSubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
        >
            <input
                className="modal-input"
                type="text"
                value={title}
                onChange={(e) => setLocalTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <input
                className="modal-input"
                type="text"
                value={short_description}
                onChange={(e) => setLocalShortDescription(e.target.value)}
                placeholder="Short Description"
                maxLength="150"
                required
            />
            <ReactQuill
                className="modal-editor"
                value={description}
                onChange={setLocalDescription}
                placeholder="Description"
            />
            <input
                className="modal-input"
                type="text"
                value={phone_number}
                onChange={(e) => setLocalPhoneNumber(e.target.value)}
                placeholder="Phone Number (10 digits)"
                required
            />
            <button className="modal-save-button" type="submit">
                Save Changes
            </button>
        </form>
    </div>
</div>

        );
    };
    const [isOpen, setIsOpen] = useState(false); // Track whether the section is open or closed

    const toggleSection = () => {
        setIsOpen(!isOpen); // Toggle the state on click
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
                        {success && <p className="success-message">{success}</p>}
                        
                         <h1 className='createdby'>By {campaign.firstname} {campaign.lastname} </h1>
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

                            {isLoggedIn && currentUserId === campaign.created_by && ( 
                                  <div className="edit-section">
                          <button className="edit-campaign-button" onClick={() => handleEditClick(campaign)}> Edit Campaign </button> 
                           </div>)}
                           {isEditModalOpen && (
                 <EditModal  campaign={editingCampaignData} onClose={() => setIsEditModalOpen(false)}  onSave={handleUpdateCampaign} />)}
                         <hr />
                         <div className="donation-section">
    {campaign.raised_amount >= campaign.goal_amount ? (
        <p className="goal-reached-message">🎉 The fundraising goal has been reached! Thank you for your support. 🎉</p>
    ) : currentUserId !== campaign.created_by ? (
        <button className="donate-button" onClick={toggleDonateModal}>Donate Now</button>
    ) : (
        <p></p>
    )}
</div>

                

<div className="donator-section">
    <h2>Contributor</h2>
    {donations.length > 0 ? (
        <div className="donation-table-container">
            <table className="donation-table">
                <thead>
                    <tr>
                        <th>Donator</th>
                        <th>Amount Donated</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.slice(0, 5).map((donation, index) => (
                        <tr key={index}>
                            <td>{donation.firstName} {donation.lastName}</td>
                            <td>{donation.amount}฿</td>
                            <td>{donation.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <p>No donations yet.</p>
    )}
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
                                                    <h3><strong>{comment.firstName || 'Anonymous'}</strong> </h3>
                                                    <p>{comment.commentText}</p>
                                                    <p><small>{new Date(comment.timestamp).toLocaleString()}</small></p>
                                                    { editingCommentId === comment.commentId ? (
                                                        <div className='editsection'>
                                                            <textarea className='editarea'
                                                                value={editedText}
                                                                onChange={(e) => setEditedText(e.target.value)}
                                                            />
                                                            <button className='saveedit' onClick={() => handleCommentSaveEdit(comment.commentId)}>Save</button>
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
            {showLoginPromptModal && (
    <div className="modal-overlay" onClick={closeLoginPromptModal}>
        <div className="modals-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeLoginPromptModal}>
                &times;
            </button>
            <h2>Login Required</h2>
            <p>You must log in before making a donation.</p>
        </div>
    </div>
)}
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

<div className="top-contributors">
            <div className="header" onClick={toggleSection}>
                <h3>Top Contributors</h3>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span> {/* Arrow icon */}
            </div>
            {isOpen && (
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Donated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topDonations.map((contributor, index) => (
                            <tr key={index}>
                                <td>{contributor.donor_first_name}</td>
                                <td>{contributor.donor_last_name}</td>
                                <td>{contributor.total_donated}฿</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

            <Footer />
        </>
    );
}

export default CampaignsDetailsPage;