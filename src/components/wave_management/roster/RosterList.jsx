import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import  Scrollbars  from 'react-scrollbar';

class RostersList extends React.Component{
	constructor(props){
		super(props)
		this.state = {rosters:null}
		this.redirectOnNew = this.redirectOnNew.bind(this)
	}
	componentDidMount(){
		const{firebase,auth}  = this.props
		if(!auth){
			return null
		}
		let this_ = this
		let rosters = firebase.database().ref('/rosters').orderByChild("admin_id").equalTo(auth.uid).once('value').then(function(snapshot) {
		  	var listRosters = snapshot.val();
		  	this_.setState({rosters:listRosters})
		});
	}
	componentWillReceiveProps(nextProps){

	}
	redirectOn(id){
		this.props.router.push(window.basepath+'/rosterdetails/'+id)
	}
	redirectOnNew(){
		this.props.router.push(window.basepath+'/newroster')
	}
	renderRosters(){
		const{ rosters } = this.state
		if(!rosters){
			return null
		}
		const rosterList = ()=>{
			return Object.keys(rosters).map((row,k)=>
				  	<tr className="cursor-pointer" onClick={(e)=>this.redirectOn(row)} key={k}>
				  		<td>{rosters[row]?rosters[row].title:""}</td>
				  		<td>{rosters[row]?rosters[row].students?rosters[row].students.length:0:0}</td>
					</tr>
			)
		}
		return( <tbody>{rosterList()}</tbody>)
	}
	render(){

		return(
			<div className="card m-top-default">
			 <h5 className="card-title">
			 	Roster
	    		<div className="float-right">
	    			<button onClick={this.redirectOnNew}  className="btn btn-md bg-principal b-round p-l-r" type="button">Add New Roster</button>
	    		</div>
			 </h5>
			  <div className="card-body text-center">
			  	<div className="row">
			  		<div className="col-lg-12">
			  			<br/>
			  			<Scrollbars speed={1} className="area-table-scroll" horizontal={false} vertical={true} >
			  			<div className="table-responsive">
							<table className="table ">
							  <thead>
							    <tr>
							      <th className="td-bold text-center" scope="col">Name</th>
							      <th className="td-bold text-center " scope="col"># of Members</th>
							    </tr>
							  </thead>
							 {this.renderRosters()}
							</table>
						</div>
						</Scrollbars>
			  		</div>
			  	</div>
			  </div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {

	return {
		auth:state.firebase.auth
	};
};

const firebaseConnectProps = () =>{

}  

export default compose(
	firebaseConnect((state,props)=>{
		return []
	})
,connect(mapStateToProps))(RostersList)