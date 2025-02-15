import { IMessage, useConversationStore } from '@/store/chatStore'
import { useMutation } from 'convex/react'
import { Ban, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../../convex/_generated/api'
import { MouseEvent } from 'react'

type ChatAvatarActionsProps = {
    message: IMessage;
    me: any;
};

const ChatAvatarActions = ({ me, message }: ChatAvatarActionsProps) => {
    const { selectedConversation, setSelectedConversation } = useConversationStore();

    const isMember = selectedConversation?.participants.includes(message.sender?._id);
    const kickUser = useMutation(api.conversations.kickUser);
    const createConversation = useMutation(api.conversations.createConversation);
    const fromAI = message.sender?.name === 'Gemini';
    const isGroup = selectedConversation?.isGroup;

    const handleKickUser = async (e: MouseEvent) => {
        if (fromAI) return;
        e.stopPropagation();
        if (!selectedConversation) return;
        try {
            await kickUser({
                conversationId: selectedConversation?._id,
                userId: message.sender._id,
            });

            setSelectedConversation({
                ...selectedConversation,
                participants: selectedConversation.participants.filter((id) => id !== message.sender?._id),
            });
        } catch (error) {
            console.log(error)
            toast.error('Failed to remove user');
        }
    };

    const handleCreateConversation = async () => {
        if (fromAI) return;

        try {
            const conversationId = await createConversation({
                isGroup: false,
                participants: [me?._id, message.sender?._id],
            });

            setSelectedConversation({
                _id: conversationId,
                name: message.sender.name,
                participants: [me?._id, message.sender?._id],
                isGroup: false,
                isOnline: message.sender?.isOnline,
                image: message.sender?.image,
            });
        } catch (error) {
            console.log(error)
            toast.error('Failed to create conversation');
        }
    };

    return (
        <div
            className='text-[11px] flex gap-4 justify-between font-bold cursor-pointer group'
            onClick={handleCreateConversation}
        >
            {isGroup && <p className='whitespace-nowrap pb-1 px-1 text-sm'>{message.sender?.name}</p>}

            {!isMember && !fromAI && isGroup && <Ban size={16} className='text-red-500 mt-1' />}
            {isGroup && isMember && !fromAI && selectedConversation?.admin === me?._id && (
                <LogOut size={16} className='text-red-500 opacity-0 group-hover:opacity-100 mt-1' onClick={handleKickUser} />
            )}
        </div>
    );
};
export default ChatAvatarActions;
