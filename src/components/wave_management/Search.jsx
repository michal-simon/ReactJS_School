import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import browserHistory from 'history/createBrowserHistory'
import SearchList from './SearchList'
import Select from '../common/Select'
import  Scrollbars  from 'react-scrollbar';
import { capitalize } from '../common/Helpers.js'
import Pagination from'../common/Pagination'
class Search extends React.Component{
	getInitialState(){
		return {
			first_name:"",
			last_name:"",
			current_location:"",
			grade:"",
			dorm:"",
			gender:"",
			list:"table",
			classScroller:"area-table-scroll",
			last_value:"",
			locations:{},
			dorms:{},
			grades:{}
		}
	}
	constructor(props){
		super(props)
		this.state = this.getInitialState()
		this.redirectOn = this.redirectOn.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.handleList = this.handleList.bind(this)
	}
	componentDidMount(){
		const{firebase,auth,params}  = this.props
		if(!auth){
			return null
		}
		let this_ = this

		let locations = firebase.database().ref('/locations').once('value').then(function(snapshot) {
		  	this_.setState({locations:snapshot.val()})
		});
		let dorms = firebase.database().ref('/dorms').once('value').then(function(snapshot) {
		  	this_.setState({dorms:snapshot.val()})
		});
		let grades = firebase.database().ref('/grades').once('value').then(function(snapshot) {
		  	this_.setState({grades:snapshot.val()})
		});
	}
	handleSearch(event){
		this.setState({[event.target.name]:event.target.value})
		this.setState({last_value:event.target.name})
	}
	handleList(name,ee){
		let classScroller="area-table-scroll"
		if(name=="list"){
			classScroller = ""
		}
		this.setState({list:name,classScroller:classScroller})
	}
	redirectOn(id){
		const{role} = this.props
		let redirect_url = "s-profile"
		if(role=="faculty"){
			redirect_url="faculty-s-profile"
		}
		this.props.router.push(window.basepath+'/'+redirect_url+'/'+id)
	}
	passFilters(){
		const{ last_value } = this.state
		var query = last_value !="" ? this.state[last_value] !="" ? "orderByChild="+last_value+"&startAt="+capitalize(this.state[last_value])+"&endAt=" + capitalize(this.state[last_value]) + "z"  :""  : ""
	
		return query;
	}

	removeThFromString(value,name){
		if(name=="grade"){
			return value.replace('th','')
		}
		return value
		
	}
	renderSelect(txt,options,name,key_value){
		if(!options){
			return null
		}

		const optionsList =() =>{
			return Object.keys(options).map((row,key)=>
				<option key={key} value={this.removeThFromString(options[row][key_value],name)} > {options[row][key_value]} </option>
			)
		}
		return <select value={this.state[name]} className="form-control" name={name} onChange={this.handleSearch} >
			      <option value="">{txt}</option>
			      {optionsList()}
		    </select>
	}
	renderHeaderLabel(){
		if(this.state.list=="list"){
			return;
		}
		return(
		    <tr>
		      <th style={{width:'16.66666'}} className="td-bold" scope="col">First Name</th>
		      <th style={{width:'16.66666'}} className="td-bold" scope="col">Last Name</th>
		      <th style={{width:'16.66666'}} className="td-bold" scope="col">Grade</th>
		      <th style={{width:'16.66666'}}  className="td-bold" scope="col">Gender</th>
		      <th style={{width:'16.66666'}}  className="td-bold" scope="col">Location</th>
		      <th style={{width:'16.66666'}}  className="td-bold" scope="col">Dorm</th>
		    </tr>
		);
	}
	classSwitch(name){
		return this.state.list == name ? " text-danger ":" "
	}
	render(){
		const{locations,grades,dorms} = this.state
		return(
			<div className="card m-top-default">
			 <h5 className="card-title">
			 Search
			 </h5>
			  <div className="card-body text-center">
			  	<div className="row">
				  	<div className="col-lg-12">
				  		<div className="float-right">
				  			<i onClick={(e)=>this.handleList('table',e)} className={"fa  fa-list-ul float-right my-fa cursor-pointer " + this.classSwitch('table') } aria-hidden="true"></i>
				  			<i onClick={(e)=>this.handleList('list',e)} className={"fa fa-table float-right my-fa cursor-pointer " + this.classSwitch('list') } style={{marginRight:"10px"}} aria-hidden="true"></i>
				  		</div>
				  	</div>
		  			<br />
		  			<br />
		  			<div className="col-lg-12">
			  			<div className="row">
			  				<div className=" col-xs-12 col-sm-6 col-md-2">
					  			<div className="form-search form-group">
					  				<input className="form-control" value={this.state.first_name} name="first_name" placeholder="First Name" onChange={this.handleSearch}/>
					  				<i className="fa fa-search my-fa"></i>
					  			</div>
			  				</div>
			  				<div className=" col-xs-12 col-sm-6 col-md-2">
					  			<div className="form-search form-group">
					  				<input className="form-control"  value={this.state.last_name} name="last_name" placeholder="Last Name" onChange={this.handleSearch} />
					  				<i className="fa fa-search my-fa"></i>
					  			</div>
			  				</div>
			  				<div className=" col-xs-12 col-sm-6 col-md-2">
			  					<div className="form-group">
			  						{this.renderSelect('All Grades',grades,'grade','grade')}
			  					</div>
			  				</div>
			  				<div className=" col-xs-12 col-sm-6 col-md-2">
				  				<div className="form-group">
									<select value={this.state.gender} className="form-control" name="gender" onChange={this.handleSearch} >
										<option value="">All Gender</option>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
									</select>
								</div>
			  				</div>
			  				<div className=" col-xs-12 col-sm-6 col-md-2">
			  					<div className="form-group">
			  						{this.renderSelect('All Location',locations,'current_location','location_name')}
			  					</div>
			  				</div>
			  				<div className=" col-xs-12 col-sm-6 col-md-2">
			  					<div className="form-group">
			  						{this.renderSelect('All Dorm',dorms,'dorm','dorm')}
			  					</div>
			  				</div>
			  			</div>		  				
		  			</div>
			  		<div className="col-lg-12">
						<Scrollbars speed={1} className={this.state.classScroller} horizontal={false} vertical={true} >
						<div className="table-responsive-xl">
						<table className="table">
						  <thead>
						    {this.renderHeaderLabel()}
						  </thead>
							{
								this.state.list=="table"?<SearchList filters={this.passFilters()} redirectOn={this.redirectOn} role={this.props.role} list={this.state.list}/>:null
							}
						</table>
						</div>
						</Scrollbars>
			  		</div>
			  	</div>
			  	<Scrollbars speed={1} className="area-table-scroll" horizontal={false} vertical={true} >
				    <div className="row">
					  
							{
								this.state.list=="list"?<SearchList filters={this.passFilters()} redirectOn={this.redirectOn} role={this.props.role} list={this.state.list}/>:null
							}
						
				    </div>
			    </Scrollbars>
				<Pagination />
			  </div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	
	return {
		auth: state.firebase.auth,
	};
};

export default compose(
	 firebaseConnect((state,props)=>{
	 	return []
	 })
,connect(mapStateToProps))(Search)