import axios from "axios";
import { UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { addConnection } from "../features/connectionSlice.js";
import { useDispatch, useSelector } from "react-redux";
import ConnectionCard from "../components/connectionCard.jsx";
import Loading from "../components/Loading.jsx";

function Connections() {
  const [loading, setLoading] = useState(true);
  const connections = useSelector((store) => store?.connections || []);
  const dispatch = useDispatch();
console.log(connections)
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/user/connections",
          { withCredentials: true }
        );
        dispatch(addConnection(response?.data?.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  if (loading) {
    return <Loading />;
  }


  return (
    <div className="flex-1 flex flex-col items-center px-5 pb-5">
      <div className="md:w-3/5 w-full mx-auto flex-1 flex flex-col ">
        {connections?.length > 0 ? (
          <div className="w-full  ">
            {connections?.map((connection) => (
              <div key={connection?._id}>
               {connection&& <ConnectionCard connection={connection} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex flex-1 flex-col items-center justify-center ">
            <UserCheck className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="md:text-xl font-bold mb-2 text-gray-600">
              No connections yet
            </h3>
            <p className="mb-6 text-gray-400">
              Start swiping to connect with other developers
            </p>
            <NavLink
              to="/app"
              className="inline-flex text-white items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-purple-500/20"
            >
              Find Developers
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;
