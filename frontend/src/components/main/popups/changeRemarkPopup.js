import { useContext, useRef, forwardRef} from "react";
import { DataContext } from "../../common/dataContext";

const ChangeRemarkPopup = forwardRef((props,ref) => {
    const inputRef = useRef(null); 
    const {changeRemark} = useContext(DataContext)
    const setShowRemarkPopup = props.setShowRemarkPopup;


    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            changeRemarkHandler();
        }
    };

    function changeRemarkHandler(){
        setShowRemarkPopup(false);
        let newRemark = inputRef.current.value
        changeRemark(props.id, newRemark)
    }

    return (
        <div className="change-remark-popup" ref={ref}>
            <input type="text" placeholder={`change remark for ${props.username}`} className="change-remark-bar" ref={inputRef} tabIndex={0} onKeyDown={handleInputKeyDown}></input>
            <button className="change-remark-button" onClick={changeRemarkHandler}>Change Remark</button>
        </div> 
    )
})

export default ChangeRemarkPopup