import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import Loading 		from 'react-loading';
import RosterStudents from './RosterStudents'
import  Scrollbars  from 'react-scrollbar';

class RosterDetails extends React.Component{
	getInitialState(){
		return {
			first_name:"",
			message:""
		}
	}
	constructor(props){
		super(props)
		this.state = this.getInitialState()
		this.handleSearch = this.handleSearch.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
		this.deleteRosterStudent = this.deleteRosterStudent.bind(this)
		this.handleDeleteRoster = this.handleDeleteRoster.bind(this)
		this.redirectOnRosters = this.redirectOnRosters.bind(this)
	}
	handleSearch(event){
		this.setState({[event.target.name]:event.target.value})
	}
	componentWillReceiveProps(nextProps){}
	deleteRosterStudent(row,event){
		const  {params,roster,firebase} = this.props
		if(!params.id){
			return null
		}
		if( window.confirm("Are you sure you wish to delete this item")){

			if(roster.students.indexOf(row) != -1 ){
				roster.students.splice(roster.students.indexOf(row),1);	
			}

			firebase.update(`rosters/${params.id}`, { students: roster.students  })

			let this_ = this
			this.setState({message:"Roster Student deleted succesfully"})
			setTimeout(function(){
				this_.setState({message:""})
			},3000)
		}

	}
	handleDeleteRoster(event){
		const {leave,firebase,params} = this.props
		let this_ = this
		if(window.confirm("Are you sure to want to delete this Roster")){

			firebase.remove('rosters/'+params.id)
			this.setState({message:"Roster is deleted"})

			setTimeout(function(){
				this_.props.router.push(window.basepath+'/listroster')
			},2000)	
		}
		
		
	}
	handleAdd(event){
		event.preventClick
		const {firebase} = this.props
		firebase.push('authors', { name: 'Klevis Cipi', done: 12 })
	}

	passFilters(){
		const{ first_name} = this.state
		let values = {
			first_name:first_name,
		}
		let newValues = {}

		Object.keys(values).map((row)=>{
			if(!values[row]==""){
				newValues[row] = "orderByChild="+row+"&equalTo="+values[row]
			}else{
				newValues[row] = ""
			}
		})
		return newValues
	}
	redirectOnRosters(){
		this.props.router.push(window.basepath+'/listroster')
	}
	renderSuccess(){
		return this.state.message?<div className="alert alert-success" role="alert">{this.state.message}</div>:null
	}
	renderBody(){
		const  { roster,params} = this.props
		
		if(!roster || !params.id){
			return null
		}

		return(
			<div>
			 <h5 className="card-title"> {this.props.roster.title}
			 	<div className="float-right">
			 		<button  onClick={this.handleDeleteRoster}  className="btn btn-md float-right bg-red b-round" type="button">Delete Roster</button>
			 		<button  onClick={(e)=>this.props.router.push(window.basepath+'/newroster/'+params.id)}  className="btn btn-md float-right bg-warning b-round" type="button">  Edit Roster </button>
			 		<button style={{marginRight:"5px"}}  className="btn btn-md bg-principal b-round float-right" type="button" onClick={this.redirectOnRosters}> <i className="fa fa-arrow-left	"></i> Back to Roster List</button>
			 	</div>
			 </h5>
			  <div className="card-body text-center">
			  	<div className="row">
			  		<div className="col-lg-12">
			  			<div className="form-search">
			  				<input className="form-control" name="first_name" value={this.state.first_name} placeholder="Search By name" onChange={this.handleSearch}/>
			  				<i className="fa fa-search my-fa"></i>
			  			</div>
			  			<br/>
			  			<Scrollbars speed={1} className="area-table-scroll" horizontal={false} vertical={true} >
			  			<div className="table-responsive">
						<table className="table ">
						  <thead>
						    <tr>
						      <th className="td-bold text-center" scope="col">First Name</th>
						      <th className="td-bold text-center " scope="col">Last Name</th>
						      <th className="td-bold text-center" scope="col">Grade</th>
						      <th className="td-bold text-center" scope="col">Gender</th>
						      <th className="td-bold text-center" scope="col">Location</th>
						      <th className="td-bold text-center" scope="col">Dorm</th>
						    </tr>
						  </thead>
						  <RosterStudents filters={this.passFilters()} roster={this.props.roster} deleteRosterStudent={this.deleteRosterStudent} redirectOn={this.redirectOn} />
						</table>
						</div>
						</Scrollbars>
			  		</div>
			  	</div>
			  </div>
			</div>
		)
	}
	render(){
		return(
			<div className="card m-top-default">
			{this.renderSuccess()}
			{this.renderBody()}
			</div>
		)
	}
}

const mapStateToProps = (state,props) => {
	
	return {
		roster: state.firebase.data.rosters ?  state.firebase.data.rosters[props.params.id] : null,
	} 
};

const firebaseConnectProps = () =>{

}  

export default compose(
	 firebaseConnect((props)=>{
	 	return [
    	'rosters/'+props.params.id,
  		]
	 })
,connect(mapStateToProps))(RosterDetails)