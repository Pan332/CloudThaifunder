import './Dashboard.css'; // Optional: for custom styling
import Search from "../components/Search.jsx";
import { CampaignProvider } from '../components/CampaignContext';

function Dashboard(){
    return(
    <div className="dashboard">
        <div className='headers'>
            <div className='pic'>
                <h1 className='overlay-text'>Fundraiser</h1>
                <p className='overlay-text2'>For charities No fee.</p>
                <div className='pic'>
                    <h1 className='overlay-text'>Fundraiser</h1>
                    <p className='overlay-text2'>For charities No fee.</p>
                        <div className='custom-search-container'>
                            <CampaignProvider>
                                 <Search/>
                             </CampaignProvider>
                        </div>
                    
                </div>
            </div>
        </div>
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
        </div>
    );

}
export default Dashboard;