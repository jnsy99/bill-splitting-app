import { BrowserRouter, Route, Routes } from "react-router-dom";
import FinalBill from "../pages/FinalBill";
import FriendView from "../pages/FriendView";
import GenerateLink from "../pages/GenerateLink";
import Home from "../pages/Home";
import Split from "../pages/Split";
import UploadReceipt from "../pages/UploadReceipt";

const RouteComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-link/:id" element={<GenerateLink />} />
        <Route path="/share/:id" element={<FriendView />} />
        <Route path="/upload-receipt" element={<UploadReceipt />} />
        <Route path="/split" element={<Split />} />
        <Route path="/final-bill/:splitOption" element={<FinalBill />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteComponent;
