import React, { useState, useEffect, useRef } from "react";
import AppNavbar from "../components/AppNavbar";
import { Input, Spinner } from "@nextui-org/react";
import {
  CHAT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  client,
} from "../config/appwriteConfig";
import { AppwriteException, ID, Models } from "appwrite";
import { userStore } from "../state/userStore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { chatStore } from "../state/chatsStore";

export default function ChatSection() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const user = userStore(
    (state) => state.user
  ) as Models.User<Models.Preferences>;
  const [loading, setLoading] = useState(false);
  const isFetched = useRef(false);

  const chatState = chatStore();

  useEffect(() => {
    if (!isFetched.current) {
      fetchMessage();

      //   * For Realtime Things
      client.subscribe(
        `databases.${DATABASE_ID}.collections.${CHAT_COLLECTION_ID}.documents`,
        (response) => {
          console.log("The realtime response is ", response);
          const payload = response.payload as Models.Document;

          //   * If It's new message
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            if (user.$id !== payload["user_id"]) {
              chatState.addChat(payload);
            }
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            chatState.deleteChat(payload.$id);
          }
        }
      );

      isFetched.current = true;
    }
  }, []);

  // * To handle submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    databases
      .createDocument(DATABASE_ID, CHAT_COLLECTION_ID, ID.unique(), {
        message: message,
        user_id: user.$id,
        community_id: id,
        name: user.name,
      })
      .then((res) => {
        chatState.addChat(res);
        setMessage("");
      })
      .catch((err: AppwriteException) => {
        toast.error(err.message, { theme: "colored" });
      });
  };

  //   * Fetch all messages
  const fetchMessage = () => {
    setLoading(true);
    databases
      .listDocuments(DATABASE_ID, CHAT_COLLECTION_ID)
      .then((res) => {
        setLoading(false);
        chatState.addChats(res.documents);
      })
      .catch((err: AppwriteException) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  //   * Delete message
  const deleteMessage = (id: string) => {
    databases
      .deleteDocument(DATABASE_ID, CHAT_COLLECTION_ID, id)
      .then(() => {
        chatState.deleteChat(id);
      })
      .catch((err: AppwriteException) => {
        toast.error(err.message, { theme: "colored" });
      });
  };
  return (
    <div>
      <AppNavbar />
      <div className="h-screen w-screen">
        <div className="text-center">
          {" "}
          {loading && <Spinner color="danger" />}
        </div>
        <div className="flex flex-col">
          {/* Display all messages */}
          <div className="flex-1 p-4 mb-20">
            {chatState.chats.length > 0 &&
              chatState.chats.map((item) =>
                item["user_id"] === user.$id ? (
                  <div className="flex justify-end mb-2" key={item.$id}>
                    <div className="bg-purple-400 px-4 py-2 max-w-lg rounded-xl">
                      <h1 className="font-bold">{item["name"]}</h1>
                      <h1>{item["message"]}</h1>

                      <div className="flex justify-end">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-2 text-red-500 cursor-pointer"
                          onClick={() => deleteMessage(item.$id)}
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start mb-2" key={item.$id}>
                    <div className="bg-green-400 px-4 py-2 max-w-lg rounded-xl">
                      <h1 className="font-bold">{item["name"]}</h1>
                      <h1>{item["message"]}</h1>
                    </div>
                  </div>
                )
              )}
          </div>

          {/* Input Box */}
          <div
            className="p-4 bottom-0 left-0 right-0 bg-white"
            style={{ position: "fixed" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  label="Type message..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
