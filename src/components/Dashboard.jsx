import './Dashboard.css'; // Optional: for custom styling

function Dashboard(){
    return(
        <div className="dashboard">
            <div className='header'>
            <h1 className='main-text'>Fundraiser</h1>
            <p className='text'>For charities no fee.</p>
            </div>
            <hr />
           
            <div className='visualization'>
                <div className='totalcampaign'>
                <h2>Total Campaigns</h2>
                <h2>30</h2>

                </div>
                <div className='totalfund'>
                <h2>Total Funds</h2>
                <h2>8,000฿</h2>

                </div>
                <div className='paticipant'>
                <h2>Paticipants</h2>
                 <h2>56</h2>
                </div>
            </div>
       
            
         <hr />

        </div>
    );

}
export default Dashboard;