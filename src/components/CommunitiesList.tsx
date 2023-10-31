import { useEffect, useRef, useState } from "react";
import {
  COMMUNITY_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../config/appwriteConfig";
import { AppwriteException, Query } from "appwrite";
import { toast } from "react-toastify";
import { communityStore } from "../state/communityStore";
import { Spinner, Card, CardBody, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function CommunitiesList() {
  const [loading, setLoading] = useState(false);
  const isDataFetched = useRef(false);
  const communityState = communityStore();
  useEffect(() => {
    if (!isDataFetched.current) {
      setLoading(true);
      databases
        .listDocuments(DATABASE_ID, COMMUNITY_COLLECTION_ID, [
          Query.select(["$id", "name"]),
        ])
        .then((res) => {
          console.log("The response is", res.documents);
          setLoading(false);
          communityState.addCommunities(res.documents);
        })
        .catch((err: AppwriteException) => {
          toast.error(err.message, { theme: "colored" });
          setLoading(false);
        });

      isDataFetched.current = true;
    }
  }, []);

  return (
    <div>
      <div className="text-center">
        {" "}
        {loading && <Spinner color="danger" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {communityState.communities.length > 0 &&
          communityState.communities.map((item) => (
            <Card key={item.$id}>
              <CardBody>
                <h1 className="text-xl font-bold">{item["name"]}</h1>
                <p className="py-2">Found more people in this community</p>
                <Link to={`/chats/${item.$id}`}>
                  <Button color="danger" className="w-full">
                    Chat
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
      </div>

      {/* If no communuty found */}
      {communityState.communities.length <= 0 && loading == false && (
        <div className="text-center">
          <h1 className="text-danger-400 font-bold text-2xl">
            No Community Found
          </h1>
          <p>Be the first one to create unique community</p>
        </div>
      )}
    </div>
  );
}
