import axios from "axios";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../features/requestsSlice.js";
import RequestCard from "../components/RequestCard.jsx";
import Loading from "../components/Loading.jsx";

const Requests = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const request = useSelector((store) => store.requests);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/user/requests/received",
          {
            withCredentials: true,
          }
        );
        dispatch(addRequests(response.data.data));
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRequest = async (requestId, status) => {
    try {
      const response = await axios.post(
        `http://localhost:7000/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(requestId));
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full flex-1 flex flex-col items-center  px-5 pb-5">
      <div className="md:w-3/5 w-full mx-auto flex-1 flex flex-col justify-center">
        {request.length > 0 ? (
          <div className="w-full ">
            {request.map((request) => (
              <div key={request._id}>
                <RequestCard request={request} onClick={handleRequest} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1  flex flex-col items-center justify-center">
            <UserPlus className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-600">
              No pending requests
            </h3>
            <p className="mb-6 text-gray-400 text-center">
              You don't have any connection requests at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
