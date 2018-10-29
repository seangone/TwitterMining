import React from 'react';
import {TwitterTweetEmbed} from 'react-twitter-embed';

const apiurl = "http://18.144.22.172:8080/api";
const data = [
    {
        "title":"trump",
        "tweetId":"1056865271804256256",
        "score":-211},
    {
        "title":"james",
        "tweetId": "1056865004085903360",
        "score":211
    }];

class ScoresDashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: data
        };
    }

    componentDidMount() {
        this.fetchScores();
    }
    // communication with backend
    fetchScores() {
        const url = apiurl + "/sentiments";
        console.log("Fetch URL: " + url);
        fetch(url, {method: 'GET', mode: 'cors'})
            .then(res => res.json())
            .then(
                (raw) => {
                    console.log("fetchTopics Success: size " + raw.length);
                    let fined = raw.map((line) => {
                        return {
                            title: line.topic,
                            tweetId: line.last_status_id,
                            score:  Math.round(line.score)
                        };
                    }).filter(line => line.title !== "");
                    this.setState({
                        isLoaded: true,
                        data: fined
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log("err" + error.message);
                    this.setState({
                        isLoaded: true,
                        error,
                        data: [],
                    });
                }
            )
    };

    //render
    render(){
        const {error, isLoaded} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (this.state.data == null) {
            return <div>Null</div>;
        }

        let cards = this.state.data.map((card, index) => {
            return (
                <Card cardtitle={card.title} score={card.score} tweetId={card.tweetId}/>
            );
        });
        return (
            <div className="row" id="ScoresDashboard">
                {cards}
            </div>
        );
    };
}

class Card extends React.Component {
    render(){
        let badge;
        if (this.props.score >= 20) {
            badge = <span className="badge badge-success badge-pill">{this.props.score}</span>;
        } else if (this.props.score <= -20) {
            badge = <span className="badge badge-danger badge-pill">{this.props.score}</span>;
        } else {
            badge = <span className="badge badge-warning badge-pill">{this.props.score}</span>;
        }
        return (
            <div className="card border-0 col-12 col-lg-6 col-md-6 p-0">
                <div className="card-body p-4">
                    <div className="card-title d-flex justify-content-between align-items-center">
                        <h5 className="mb-1">{this.props.cardtitle}</h5>
                        {badge}
                    </div>
                    <TwitterTweetEmbed tweetId={this.props.tweetId}/>
                </div>
            </div>
        );
    };
}

export default ScoresDashboard;
