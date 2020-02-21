import React from "react";
import {connect} from "react-redux";
import UserPublicCard from '../molecules/UserPublicCard';
import {Nav,NavItem} from 'react-bootstrap';
import {makeGetOneByIdSelector} from "../selectors";
import {getOneByIdIfNeeded} from "../actions";


const NAV_INFO = 'INFORMATIONS';
const NAV_ARTICLES = 'ARTICLES';


class UserPublic extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            activeNav:NAV_INFO
        };
    }

    componentDidMount()
    {
        const {dispatch,id} = this.props;
        dispatch(getOneByIdIfNeeded("user",{
            description:true,
            detailImage:{activeVersion:{urlMini:true,urlDetailThumbnail:true}} }
            , id));
    }

    componentDidUpdate(prevProps)
    {

    }

    render()
    {
        const {getOneById,id} = this.props;
        const user = getOneById(+id);
        const {activeNav} = this.state;

        console.log(user);

        return (
            <div className="content-wrapper hb-container">
                <section className="content-header">
                    <Nav bsStyle="pills" activeKey={activeNav} onSelect={(e)=>{console.log(e)}}>
                        <NavItem eventKey={NAV_INFO} >
                            Informations
                        </NavItem>
                        <NavItem eventKey={NAV_ARTICLES}>
                            Ses Articles
                        </NavItem>
                    </Nav>
                </section>
                <section className="content">
                    <h3>Informations</h3>
                        <UserPublicCard user={user}/>
                </section>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const getOneByIdSelector = makeGetOneByIdSelector();
    return state => {
        return {
            getOneById: getOneByIdSelector(state.get("user")),
        }
    }
};

export default connect(makeMapStateToProps)(UserPublic);
