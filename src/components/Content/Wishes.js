import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {Wish} from '../../Wish';
import {Wishes} from '../../assets/ItemAux';
import ResourcePriorityForm from '../ResourcePriorityForm/ResourcePriorityForm';
import WishForm from '../WishForm/WishForm';
import {default as Crement} from '../Crement/Crement';

class WishComponent extends Component {
        constructor(props) {
                super(props);
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
                event.preventDefault();
        }

        handleChange(event, name, idx = -1) {
                let val = event.target.value;
                let state = {
                        ...this.props.wishstats
                };
                if (idx < 0) {
                        state = {
                                ...state,
                                [name]: val
                        };
                        state.goal = this.goallevel(state);
                        //state.start = this.startlevel(state);
                        //state.wishtime = this.wishtime(state);
                        this.props.handleWishSettings(state);
                        return;
                }
                let wishes = [...state.wishes];
                let wish = {
                        ...wishes[idx],
                        [name]: val
                };
                wish.goal = this.goallevel(wish);
                wishes[idx] = wish;
                state = {
                        ...state,
                        wishes: wishes
                };
                this.props.handleWishSettings(state);
                return;
        }

        goallevel(data) {
                if (data.goal < 1) {
                        return 0;
                }
                data.goal = Number(data.goal)
                if (data.goal > Wishes[data.wishidx][2]) {
                        return Wishes[data.wishidx][2];
                }
                return data.goal;
        }

        startlevel(data) {
                if (data.start < 0) {
                        return 0;
                }
                if (data.start >= data.goal) {
                        return data.goal - 1;
                }
                return data.start;
        }

        wishtime(data) {
                if (data.wishtime < (data.goal - data.start) * data.wishcap) {
                        return (data.goal - data.start) * data.wishcap;
                }
                return data.wishtime;
        }

        render() {
                ReactGA.pageview('/wishes/');
                let wish = new Wish(this.props.wishstats);
                const results = wish.optimize();
                const score = results[0];
                const assignments = results[1];
                const remaining = results[2];
                return (<div className='center'>
                        <form onSubmit={this.handleSubmit}>
                                <div>
                                        {
                                                ['eE', 'mM', 'rR'].map(x => <div key={x}>
                                                        <label >
                                                                {x[1] + ' power'}
                                                                <input style={{
                                                                                width: '100px',
                                                                                margin: '5px'
                                                                        }} type="text" value={this.props.wishstats[x[0] + 'pow']} onChange={(e) => this.handleChange(e, x[0] + 'pow')}/>
                                                        </label>
                                                        <label >
                                                                {' cap'}
                                                                <input style={{
                                                                                width: '100px',
                                                                                margin: '5px'
                                                                        }} type="text" value={this.props.wishstats[x[0] + 'cap']} onChange={(e) => this.handleChange(e, x[0] + 'cap')}/>
                                                        </label>
                                                </div>)
                                        }
                                </div>
                                <label>
                                        {'Wish speed modifier:'}
                                        <input style={{
                                                        width: '40px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishspeed} onChange={(e) => this.handleChange(e, 'wishspeed')} autoFocus={true} onFocus={this.handleFocus}/>
                                </label>
                                <br/>
                                <label>
                                        {'Minimal wish time:'}
                                        <input style={{
                                                        width: '40px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishcap} onChange={(e) => this.handleChange(e, 'wishcap')} autoFocus={true} onFocus={this.handleFocus}/> {' minutes'}
                                </label>
                                <br/> {'Resource spending order:'}
                                {<ResourcePriorityForm {...this.props} handleChange={this.handleChange}/>}
                                <div><Crement header='Wish slots' value={this.props.wishstats.wishes.length} name='wishslots' handleClick={this.props.handleCrement} min={1} max={100}/></div>
                                <br/> {
                                        this.props.wishstats.wishes.map((wish, pos) => <div key={pos}>
                                                {
                                                        [Wishes.keys()].map(idx => (<div style={{
                                                                        display: 'inline'
                                                                }} key={'wishform' + pos}><WishForm {...this.props} handleChange={this.handleChange} wishidx={wish.wishidx} idx={pos}/></div>))
                                                }<label>
                                                        {' Target level:'}<input style={{
                                                        width: '20px',
                                                        margin: '5px'
                                                }} type="text" value={this.props.wishstats.wishes[pos].goal} onChange={(e) => this.handleChange(e, 'goal', pos)} autoFocus={true} onFocus={this.handleFocus}/>
                                                </label>
                                        </div>)
                                }
                                <br/> {
                                        assignments.map((a, idx) => <div key={idx}>
                                                {'Wish ' + this.props.wishstats.wishes[idx].wishidx + ' requires: ' + a}
                                        </div>)
                                }<br/> {'After ' + score + ' all targets will be reached.'}
                                <br/>
                                <br/> {'Spare resources: ' + remaining}
                        </form>
                </div >);
        };
}

export default WishComponent;