import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Spinner,
} from "@nextui-org/react";
import {
  databases,
  DATABASE_ID,
  COMMUNITY_COLLECTION_ID,
} from "../config/appwriteConfig";
import { useState } from "react";
import { AppwriteException, ID } from "appwrite";
import { toast } from "react-toastify";
import { communityStore } from "../state/communityStore";

export default function CreateCommunity() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const communityState = communityStore();

  const handleSubmit = () => {
    setLoading(true);
    databases
      .createDocument(DATABASE_ID, COMMUNITY_COLLECTION_ID, ID.unique(), {
        name: name,
      })
      .then((res) => {
        communityState.addCommunity(res);
        setLoading(false);
        toast.success("Community added successfully", { theme: "colored" });
      })
      .catch((err: AppwriteException) => {
        setLoading(false);
        toast.error(err.message, { theme: "colored" });
      });
  };

  return (
    <>
      <Button onPress={onOpen} color="danger">
        Create Community
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Community
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <Spinner color="white" /> : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
