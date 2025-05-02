import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BucketList from './pages/BucketList';
import CompletedGoals from './pages/CompletedGoals';
import Feed from './pages/Feed';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/bucket-list" element={<BucketList />} />
        <Route path="/completed" element={<CompletedGoals />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}
