import { useContext, useEffect, useRef, useState } from "react";
import DialogBox from "./dialogBox";
import { DataContext } from "../../common/dataContext";
import { convertSystemTime, getDateDiff, getUserTimeZone } from "../../../utils/commonMethods";

export default function DialogDisplayArea(){
    const {selectedUser, chatHistory} = useContext(DataContext);
    const displayAreaRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [newMessagesLoaded, setNewMessagesLoaded] = useState(false);
    const [curScrollTop, setCurScrollTop] = useState(0);

    const messageThreshold = 20;
    let chatWithCurUser = chatHistory[selectedUser.id];
    if (chatWithCurUser === undefined){
        chatWithCurUser = []
    } 

    useEffect(()=>{
        chatWithCurUser = chatHistory[selectedUser.id] || []
        setVisibleMessages(previousVisibleMessages => {
            let newVisibleMessages = [...previousVisibleMessages, chatWithCurUser[chatWithCurUser.length-1]]
            return newVisibleMessages
        })
        setNewMessagesLoaded(true)
    },[chatHistory])

    useEffect(()=>{
        chatWithCurUser = chatHistory[selectedUser.id] || []
        setVisibleMessages(chatWithCurUser.slice(-messageThreshold))
        setNewMessagesLoaded(true);
        setHasMoreMessages(true)
    },[selectedUser])

    useEffect(() => {
        if (newMessagesLoaded){
            setNewMessagesLoaded(false)
            console.log(displayAreaRef.current.scrollHeight)
            displayAreaRef.current.scrollTop = displayAreaRef.current.scrollHeight;
        }
    }, [newMessagesLoaded])

    useEffect(() => {
        if (!isLoading){
            displayAreaRef.current.scrollTop = displayAreaRef.current.scrollHeight - curScrollTop;
        }
    },[isLoading])

    const handleScroll = () => {
        const scrollableHeight = displayAreaRef.current.scrollHeight - displayAreaRef.current.clientHeight;
        const scrollPosition = displayAreaRef.current.scrollTop;
        const scrollPercentage = (scrollPosition / scrollableHeight)
        if (scrollPercentage == 0 && !isLoading && hasMoreMessages) {
          console.log("loading messages...")
          loadMessages();
        }
      };

    const loadMessages = () => {
        setIsLoading(true)
        setTimeout(() => {
            const prevScrollTop = displayAreaRef.current.scrollHeight - displayAreaRef.current.scrollTop;
            setCurScrollTop(prevScrollTop)
            const visibleMessageCount = visibleMessages.length
            // Scroll load: Load more messages based on scroll threshold
            const startIndex = Math.max(chatWithCurUser.length - visibleMessageCount - messageThreshold, 0);
            const newMessages = chatWithCurUser.slice(startIndex);
            setVisibleMessages(newMessages);
            setIsLoading(false);
            displayAreaRef.current.scrollTop = displayAreaRef.current.scrollHeight - curScrollTop;
            if (chatWithCurUser.length <= visibleMessages.length) {
                // No more messages to load
                setHasMoreMessages(false);
            }
        }, 0)
    }

    return (
        <div className="dialog-display-area" ref={displayAreaRef} onScroll={handleScroll}>
            {visibleMessages.map((chat, index) => 
                {
                    const previousChat = visibleMessages[index - 1];
                    const currentDate = getDateDiff(chat.datetime)
                    const previousDate = previousChat ? getDateDiff(previousChat.datetime) : null;
                    const showDate = currentDate !== previousDate;
                    return (
                        <div className="msg-display" key={index}>
                            {showDate && <div className="date-sign">{currentDate}</div>}
                            <DialogBox 
                                text={chat.content} 
                                datetime={new Date(chat.datetime).toLocaleTimeString([], {timeZone:getUserTimeZone(), hour12:false, hour: '2-digit', minute: '2-digit' })} 
                                self={chat.self} 
                                success={chat.success}>
                            </DialogBox>
                        </div>
                    )
                }
            )}
        </div>
    )
}