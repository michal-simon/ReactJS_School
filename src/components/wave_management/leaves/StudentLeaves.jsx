import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import{LOOKUP_STATUS} from "../../common/Helpers.js"
import  Scrollbars  from 'react-scrollbar';
import {dateFormat} from  '../../common/Dateformat.js'

class StudentLeaves extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			student:null,
			leaves:null,
			locations:null,
			leave_type:null,
			host:null,
			activeLocationsKey:true,
			activeLocation:{location_name:""}
		}
		this.handleAddLocation = this.handleAddLocation.bind(this)
		this.deleteLeave = this.deleteLeave.bind(this)
		this.redirectOn = this.redirectOn.bind(this) 
		this.redirectOnNew = this.redirectOnNew.bind(this) 
		this.handleChangeTheActiveLocation = this.handleChangeTheActiveLocation.bind(this)
	}
	handleChangeTheActiveLocation(active,event){
		this.setState({activeLocationsKey:active})
	}
	componentDidMount(){
		this.getStudents()
		this.getLeaves()
	}
	getStudents(){
		const{ firebase,params } = this.props		
		let this_ = this
		let students = firebase.database().ref('/students/'+params.id_student).once('value').then(function(snapshot) {
		  	this_.setState({student:snapshot.val()})
		});
	}
	getLeaves(){
		const{ firebase,params } = this.props
		let this_ = this
		let students = firebase.database().ref('/leaves').once('value').then(function(snapshot) {
		  	this_.setState({leaves:snapshot.val()})
		});

		let locations = firebase.database().ref('/locations').once('value').then(function(snapshot) {
		  	this_.setState({locations:snapshot.val()})
		});

		let leave_type = firebase.database().ref('/leave_type').once('value').then(function(snapshot) {
		  	this_.setState({leave_type:snapshot.val()})
		});

		let host = firebase.database().ref('/host').once('value').then(function(snapshot) {
		  	this_.setState({host:snapshot.val()})
		});
	}
	componentWillReceiveProps(nextProps){}
	redirectOn(id){
		const{params} = this.props
		if(!params.id_student){
			return null
		}

		this.props.router.push(window.basepath+'/leavedetails/'+params.id_student+"/"+id)
	}
	redirectOnNew(id){
		this.props.router.push(window.basepath+'/newleave/'+id)
	}
	handleAddLocation(row,event){
		event.preventDefault()
		const {firebase, params } = this.props
		const { student } = this.state
		if(!student){
			return null
		}
		this.setState({activeLocation:row})

		let values= {
			current_location:row.location_name,
			currentLocation_type:row.type,
		}

		firebase.update('students/'+params.id_student, values )	
		this.getStudents()	
	}
	deleteLeave(row,event){
		const {firebase} = this.props
		if( window.confirm("Are you sure to want to delete this Leave ") ){
			firebase.remove('leaves/'+row )	
			let this_ = this
			this.setState({message:"Leave deleted succesfully"})
			setTimeout(function(){
				this_.setState({message:""})
			},3000)
		}
	}
	renderLocationOn(){
		const{ params } = this.props
		const{ student,locations } = this.state
		if(!student || !locations){
			return null
		}
		let cl =""
		let onLocation ={}
		Object.keys(locations).map((row)=>{
			if(locations[row].type=="on"){
				onLocation[row] = locations[row]
			}
		})

		const renderList = ()=>{
			return Object.keys(onLocation).map((row,k)=>
				this.renderLocationButton(onLocation[row],k)
			)
		}
		return( <div>{renderList()}</div>)
	}
	renderLocationOff(){
		const{ params } = this.props
		const{ student,locations } = this.state
		if(!student || !locations){
			return null
		}
		let cl =""
		let ofLocation ={}
		Object.keys(locations).map((row)=>{
			if(locations[row].type=="off"){
				ofLocation[row] = locations[row]
			}
		})

		const renderList = ()=>{
			return Object.keys(ofLocation).map((row,k)=>
				this.renderLocationButton(ofLocation[row],k)
			)
		}
		return( <div>{renderList()}</div>)
	}
	renderLocationButton(row,k){
		const{ params } = this.props
		const{ student } = this.state
		if(!student){
			return null
		}
		let cl =""
		let current_location = student.current_location.replace(/ /g,"_").toLowerCase()
		let another_location = row.location_name.replace(/ /g,"_").toLowerCase()


		if( current_location == another_location ){
			cl = " bg-principal no-focus"
		}else{
			cl = " bg-inverse-principal "
		}
		return <button key={k} onClick={(event)=>this.handleAddLocation(row,event)}  className={ "btn btn-md b-round p-l-r  m-b btn-block " + cl} type="button">{row.location_name}</button>

	}

	renderLeaves(){
		const{params } = this.props
		const{leaves } = this.state

		if( !params || !leaves){
			return null
		}

		if(!params.id_student){
			return null
		}

		let studentLeaves ={}
		Object.keys(leaves).map((row)=>{
			
			if(leaves[row]){
				if(leaves[row].student_id == params.id_student){
					studentLeaves[row] = leaves[row]
				}
			}

		})
		const renderList = ()=>{
			return Object.keys(studentLeaves).map((row,k)=>
					  	<tr className={"cursor-pointer"} onClick={(e)=>this.redirectOn(row)} key={k}>
					  		<td className="text-center">{leaves[row].location?leaves[row].location:"-"}</td>
					  		<td className="text-center">{dateFormat(leaves[row].start_date,'dd/mm/yyyy',true)}</td>
					  		<td className="text-center">{dateFormat(leaves[row].end_date,'dd/mm/yyyy',true)}</td>
					  		<td className="text-center"><span className={LOOKUP_STATUS[leaves[row].status]?LOOKUP_STATUS[leaves[row].status].cl:"text-warning"}>{LOOKUP_STATUS[leaves[row].status]? LOOKUP_STATUS[leaves[row].status].name:leaves[row].status}</span></td>
						</tr>						
			)
		}
		return( <tbody>{renderList()}</tbody>)
	}
	renderActiveLocationTitle(){
		const {student} = this.state
		const {activeLocation,activeLocationsKey} = this.state
		if(!activeLocation){
			return null
		}
		if(!student){
			return null
		}
		return <h5 className="card-title" style={{fontSize:'30px'}}> {student.currentLocation_type=="on"?"ON":"OFF"}   {student.current_location ? student.current_location : student.location_name}</h5>
	}
	renderSuccess(){
		return this.state.message?<div className="alert alert-success" role="alert">{this.state.message}</div>:null
	}
	hasAuthorization(){
		const{role} = this.props	
		if(role=="faculty"){
			return false
		}
		return true
	}
	render(){
		const{params} = this.props
		if(!params.id_student){
			return null
		}
		return(
			<div className="card m-top-default">
			 <h5 className="card-title">My Leaves</h5>
			 	{this.renderSuccess()}
			  <div className="card-body text-center">
			  	<div className="row">

			  		<div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
					    <div className="row">
					    	<div className="col-lg-12">
					    		<div className="float-right">
					    			{ this.hasAuthorization() ? <button onClick={(e)=>this.redirectOnNew(params.id_student)}  className="btn btn-md bg-principal b-round p-l-r" type="button">Add New Leave</button> : null}
					    		</div>
					    	</div>
					    </div>
			  			<br/>
			  			<div className="table-responsive">
						  <Scrollbars speed={1} className="area-table-scroll location_st" horizontal={false} vertical={true} >
						<table className="table ">
						  <thead>
						    <tr>
						      <th className="td-bold text-center" scope="col">Name</th>
						      <th className="td-bold text-center " scope="col">Start </th>
						      <th className="td-bold text-center " scope="col"> End</th>
						      <th className="td-bold text-center " scope="col"> Status</th>
						    </tr>
						  </thead>
						  {this.renderLeaves()}
						</table>
						</Scrollbars>
						</div>
						
						<br/>
			  		</div>
			  		<div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
			  			{this.renderActiveLocationTitle()}
			  			<div className="button-on-off">
			  				<span onClick={(event)=>this.handleChangeTheActiveLocation(true,event)} className={" span-on " + (this.state.activeLocationsKey ? "active" : "") }>ON</span>
			  				<span onClick={(event)=>this.handleChangeTheActiveLocation(false,event)} className={" span-off " + ( this.state.activeLocationsKey==false ? "active" : "") }>OFF</span>
			  			</div>
			  			<div className="col-lg-12">
			  			<Scrollbars speed={1} className="area-table-scroll location_st" horizontal={false} vertical={true} >
			  				{
			  					this.state.activeLocationsKey ?  this.renderLocationOn() : this.renderLocationOff()
			  				}
			  			</Scrollbars>
			  			</div>
			  		</div>
			  	</div>
			  </div>
			</div>
		)
	}
}

const mapStateToProps = (state,props) => {
	return {
	};
};

export default compose(
	 firebaseConnect((props)=>{
	 	return [
  		]
	 })
,connect(mapStateToProps))(StudentLeaves)