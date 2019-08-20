import React from "react";
import { connect } from "react-redux";
import style from "../styles/index.scss";

import Close from "@material-ui/icons/Close";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Send from "@material-ui/icons/Send";

import io from "socket.io-client";

class Index extends React.Component {
    static getInitialProps({ reduxStore, req }) {
        return {};
    }

    constructor(props) {
        super(props);

        this.state = {
            showIcons: false,
            messages: [],
            message: ""
        };

        this.socket;
    }

    componentDidMount() {
        const that = this;

        this.socket = io.connect("http://localhost:3030");

        this.socket.emit("connectNewUser");

        this.socket.on("messageFromAdmin", function(data) {
            const { messages } = that.state;

            messages.push({
                type: "admin",
                message: data.message
            });

            that.setState({
                messages: messages
            });

            that.scrollToBottom();
        });

        this.setState({
            showIcons: true
        });

        this.scrollToBottom();
    }

    handleMessage = e => {
        const message = e.target.value;

        this.setState({
            message: message
        });
    };

    handleKeyPress = e => {
        if (e.key === "Enter") {
            this.sendMessage();
        }
    };

    sendMessage = () => {
        const { messages, message } = this.state;

        if (!message) {
            return;
        }

        this.socket.emit("messageFromUser", { message: message });

        messages.push({
            type: "user",
            message: message
        });

        this.setState({
            messages: messages,
            message: ""
        });

        this.scrollToBottom();
    };

    scrollToBottom = () => {
        let messages = document.getElementById("messages");
        messages.scrollTo(0, messages.scrollHeight);
    };

    render() {
        const { showIcons, messages, message } = this.state;

        return (
            <React.Fragment>
                <header>
                    <span>Envíanos un mensaje</span>

                    <Close
                        style={{ display: showIcons ? "inline-block" : "none" }}
                    />
                </header>

                <ul id="messages">
                    {messages.map((msg, index) => {
                        if (msg.type == "admin") {
                            return (
                                <li className={style.messageAdmin} key={index}>
                                    <AccountCircle
                                        style={{
                                            display: showIcons
                                                ? "inline-block"
                                                : "none"
                                        }}
                                    />

                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: msg.message
                                        }}
                                    />
                                </li>
                            );
                        } else {
                            return (
                                <li className={style.messageUser} key={index}>
                                    <span>{msg.message}</span>
                                </li>
                            );
                        }
                    })}
                </ul>

                <div className={style.inputChat}>
                    <input
                        type="text"
                        placeholder="Mensaje..."
                        value={message}
                        onChange={this.handleMessage}
                        onKeyPress={this.handleKeyPress}
                    />
                    <Send
                        style={{
                            display: showIcons ? "inline-block" : "none"
                        }}
                        onClick={this.sendMessage}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default connect()(Index);
