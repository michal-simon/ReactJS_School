import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import browserHistory from 'history/createBrowserHistory'
import Loading 		from 'react-loading';


class SearchList extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			activePage: 15
		};
	}
	handlePageChange(pageNumber) {

		this.setState({activePage: pageNumber});
	}
	componentDidMount(){
		this.props.setTotalItems(33);
	}
	redirectOn(id,e){
		this.props.redirectOn(id)
	}
	renderStudentsRound(){

		const{ students,firebase } = this.props

		if(!students){
			return <div style={{width:'100%'}} className="text-center">No results </div>

		}
		const showl=(loc)=>{
			return loc =="off" ? " rouded-location-red ":" rouded-location-green "
		}
		const studentsList = ()=>{
	
			var filtered = Object.keys(students).slice((this.props.currentPage - 1) * this.props.itemsPerPage, (this.props.currentPage - 1) * this.props.itemsPerPage + this.props.itemsPerPage)
			return filtered.map((row,k)=>
				<div className="col-xs-6 col-sm-6 col-md-2 c_md_2 cursor-pointer" key={k}  onClick={(e)=>this.redirectOn(row,e)}>
		            <img className="rounded-circle search-img bb" src={students[row].profile_picture} alt="Generic placeholder image" />
		            <p className="info-list-st">
			            <h5>
			            	{students[row].first_name + " " + students[row].last_name}
			            </h5>
			            <span> 
			            	 <small className={showl(students[row].currentLocation_type)}></small>
			            	 {" " + students[row].current_location + "  "}
			            </span>
			           
		            </p>
		          </div>
			)
		}
		return(studentsList())
	}
	renderStudents(){
		const{ students,firebase } = this.props

		if(!students){
			return <tr><td colSpan="6"> <div className="text-center">No results </div></td></tr>
		}

		const studentsList = ()=>{
			var filtered = Object.keys(students).slice((this.props.currentPage - 1) * this.props.itemsPerPage, (this.props.currentPage - 1) * this.props.itemsPerPage + this.props.itemsPerPage)
			return filtered.map((row,k)=>	  	<tr className="cursor-pointer"  onClick={(e)=>this.redirectOn(row,e)} key={k}>
				      	<td>{students[row].first_name}</td>
				       	<td>{students[row].last_name}</td>
				       	<td>{students[row].grade}</td>
				       	<td>{students[row].gender}</td>
				       	<td>{students[row].current_location}</td>
				       	<td>{students[row].dorm}</td>
					</tr>
			)
		}
		return( <tbody>{studentsList()}</tbody>)
	}
	render(){
		return this.props.list=="list" ? this.renderStudentsRound() : this.renderStudents() 
	}
}

const mapStateToProps = (state) => {
	return {
		students:state.firebase.data.students,
	};
};

const firebaseConnectProps = () =>{

}  

export default compose(
	firebaseConnect((state,props)=>{
		let fil = state.filters ? "#"+state.filters : ""
	 	return [
	   	'students'+fil
	  	]
	})
,connect(mapStateToProps))(SearchList)