import React, { Component } from "react";
import firebase from "../firebase";
import IconButton from "@material-ui/core/IconButton";
import { FacebookProvider, Share } from 'react-facebook';
import ShareLink from 'react-twitter-share-link'
import EmailShare from 'react-email-share-link'

import {
FacebookIcon,
TwitterIcon,
WhatsappIcon,
RedditIcon,
EmailIcon,
} from 'react-share';

class SMShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }


    render() {
        return(
            <React.Fragment>
            <FacebookProvider appId="742530042886119">
            <Share href="http://www.facebook.com">
            {({ handleClick, loading }) => (
                <IconButton onClick={handleClick} aria-label="facebook">
                <FacebookIcon size={36} round={true} />
                </IconButton>
            )}
            </Share>
            </FacebookProvider>

            <ShareLink link={this.props.share}>
            {link => (
                <a href={link} target='_blank'>
                <IconButton aria-label="twitter">
                <TwitterIcon size={36} round={true} />
                </IconButton></a>
            )}
            </ShareLink>

            <EmailShare subject="share recipe">
            {link => (
                <a href={link} data-rel="external"><IconButton aria-label="email"> <EmailIcon size={36} round={true} /> </IconButton></a>
            )}
            </EmailShare>
            </React.Fragment>
        );
    }
}

export default SMShare;

