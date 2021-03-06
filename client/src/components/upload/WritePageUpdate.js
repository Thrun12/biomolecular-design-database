import React from 'react';
import InputStyle from './InputStyle';
import help from '../../../public/Assets/icons/help.svg';
//import crossIcon from '../../../public/Assets/icons/close.svg';
//import FileWriteDisplay from './files/FileWriteDisplay';
//import classnames from 'classnames';
import NewFileBlock from './files/NewFileBlock';
//import add from '../../../public/Assets/add.png';
import update from 'react-addons-update';
import { uploadDocumentToS3, signedUrlForS3Doc } from '../../actions/fileActions';
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import classnames from 'classnames';
import { deleteFile } from '../../actions/fileActions';
import S3Image from '../S3Image';


class WritePageUpdate extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			checked: true,
			newFilesObjects: [],
			newFilesBlock: [],
			oldFilesBlock: [],
			img_link: '',
			currId: 0,
			userId: 0,
			headerImageLink: '',
			heroImageLink: '',
			filesAdded: false,
			headerImageLinkOnS3: '',
			uploadAll: false,
			updatePublishedFiles: false,
			updateFiles: false,
			btnClicked: false
		}
		this.addFileClicked = this.addFileClicked.bind(this);
		this.newFileDeleteClicked = this.newFileDeleteClicked.bind(this);
		this.getIndex = this.getIndex.bind(this);
		this.handleFileUploads = this.handleFileUploads.bind(this);
		this.backToProfile = this.backToProfile.bind(this);
		this.handleCoverFileUpload = this.handleCoverFileUpload.bind(this);
		this.handleHeroFileUpload = this.handleHeroFileUpload.bind(this);
		this.videosClicked = this.videosClicked.bind(this);
		this.previewClicked = this.previewClicked.bind(this);
		this.textClicked = this.textClicked.bind(this);
	}

	componentWillMount(){
		this.setState({checked: this.props.published, userId: this.props.auth.user.id});
        // fetch('/api/files/file/getUrl?saveUrl=' + this.props.headerImageLink).then( 
        //     function ( obj ) {
        //         this.setState({headerImageLink: obj.signedUrl});
        //     }.bind(this))
	} 

	previewClicked(){
		//console.log('preview generating');
	}

	backToProfile(){
		this.context.router.push('/profile');
	}

	handleHeroFileUpload(e){
		e.preventDefault();
		var file = e.target.files[0];
		var _saveLink = 'allFiles/'+this.props.auth.user.id+'/'+this.props.id+'/'+uuidv1()+'/'+file.name;
		this.props.uploadDocumentToS3({file, saveLink: _saveLink}).then(
			(res) => { 
				var response = JSON.parse(res.request.response);
				var queryString = 'saveLink='+response.saveLink;
				//CHANGE THE HEADERIMAGELINK IN THE DATABASE
				//CALL THIS.PROPS.CHANGEHEADERLINK FUNCTION
				this.props.changeHeroLink(_saveLink);
				this.props.signedUrlForS3Doc(queryString).then(
					(res) => {
						var response = JSON.parse(res.request.response);
                        //JMS Removed 9/18
						// this.setState({ heroImageLink: response.signedUrl });
                        // TODO: this looks like the right way to handle some other locations, but not this one now that we have the S3Image component. S3Image should maybe use the action version rather than the direct fetch.
                        this.setState({ heroImageLink: response.file_name});
					}, 
					(err) => { 
						this.setState({error: true});
						this.context.router.push('/notfound');
					}
				);
			},
			(err) => { //console.log('error'); 
		}
		);
	}
	handleCoverFileUpload(e){
		e.preventDefault();
		var file = e.target.files[0];
		var _saveLink = 'allFiles/'+this.props.auth.user.id+'/'+this.props.id+'/'+uuidv1()+'/'+file.name;
		this.props.uploadDocumentToS3({file, saveLink: _saveLink}).then(
			(res) => { 
				var response = JSON.parse(res.request.response);
				var queryString = 'saveLink='+response.saveLink;
				//CHANGE THE HEADERIMAGELINK IN THE DATABASE
				//CALL THIS.PROPS.CHANGEHEADERLINK FUNCTION
				this.props.changeHeaderLink(_saveLink);
				this.props.signedUrlForS3Doc(queryString).then(
					(res) => {
						var response = JSON.parse(res.request.response);
                        // JMS Removed 9/18
                        // See above TODO
                        // this.setState({ headerImageLink: response.signedUrl });
                        this.setState({ headerImageLink: response.file_name });
					}, 
					(err) => { 
						this.setState({error: true});
						this.context.router.push('/notfound');
					}
				);
			},
			(err) => { console.log('error'); 
		}
		);
	}

	handleFileUploads(e){
		e.preventDefault();
		var filesArray = e.target.files;
		const arrLen = filesArray.length;
		var _newFilesObjects = this.state.newFilesObjects.map((fileItem) =>{
			return fileItem;
		});
		for(var i = 0; i < arrLen; i++){
			const _file = e.target.files[i];
			var newFileItem = {
				id: this.state.currId+i,
				project_id: this.props.id,
				user_id: this.state.userId,
				title: '',
				tags: '',
				file: _file,
				file_link: null,
				description: '',
				links_array: [],
				newFilesBlock: true,
				video: false
			}
			_newFilesObjects.push(newFileItem);
			//var newFilesArray = this.state.newFilesBlock; //array of display blocks
			//newFilesArray.push(<NewFileBlock key={this.state.currId+i} isNewFile={true} newFileDeleteClicked={this.newFileDeleteClicked} file={newFileItem}/>);
		}
		this.setState({newFilesObjects: _newFilesObjects, currId: this.state.currId+arrLen });
		//this.props.uploadDocumentToS3({ file, name: 'testing_picture' })
	}
	
	textClicked(){
		var _newFilesObjects = this.state.newFilesObjects.map((fileItem) =>{
			return fileItem;
		});
		var newFileItem = {
			id: this.state.currId,
			project_id: this.props.id,
			user_id: this.state.userId,
			title: '',
			tags: '',
			file: null,
			file_link: null,
			description: '',
			links_array: [],
			newFilesBlock: true,
		}
		_newFilesObjects.push(newFileItem);
		this.setState({newFilesObjects: _newFilesObjects, currId: this.state.currId+1});
	}
	videosClicked(){
		var _newFilesObjects = this.state.newFilesObjects.map((fileItem) =>{
			return fileItem;
		});
		var newFileItem = {
			id: this.state.currId,
			project_id: this.props.id,
			user_id: this.state.userId,
			title: '',
			tags: '',
			file: null,
			file_link: null,
			description: '',
			links_array: [],
			newFilesBlock: true,
			video: true
		}
		_newFilesObjects.push(newFileItem);
		this.setState({newFilesObjects: _newFilesObjects, currId: this.state.currId+1});
	}

	addFileClicked(e){
		//ADD TO NEW FILE OBJECTS
		e.preventDefault();
		var newFileItem = {
			id: this.state.currId,
			project_id: this.props.id,
			title: '',
			tags: '',
			file_link: null,
			description: '',
			links_array: []
		}
		var newFilesArray = this.state.newFilesBlock;
		newFilesArray.push(<NewFileBlock key={this.state.currId} newFileDeleteClicked={this.newFileDeleteClicked} file={newFileItem}/>);
		this.setState({ currId: this.state.currId+1 });
	} 

	getIndex(fileId){ 
		var len=this.state.newFilesObjects.length;
		var index = -1;
		for(var i = 0; i < len; i++){
			if(this.state.newFilesObjects[i].id === fileId){
				index=i;
			}
		}
		return index;
	}

	newFileDeleteClicked(fileId){
		const index = this.getIndex(fileId);
		if(index >= 0) this.setState({ newFilesObjects: update(this.state.newFilesObjects, {$splice: [[index, 1]]}) })
	}
	
	/*getProjectId(){
		if(!updatePublishedFiles && updateFiles){
			//update associated Draft files 
			//Save As Draft was Clicked while editing a Published project 
			//1. Delete all draft File Blocks 
			//2. To Old Existing File Blocks = make an upload Request to them as well with projectId=ascProjectId
			//3. pass projectId=ascProjectId to New File Blocks
			var query = "project_id="+this.props.ascProjectId;
			this.props.deleteFile(query).then(
				(res) => {
					this.setState({uploadAll: true});
				},
				(err) => { this.context.router.push('/notfound');}
			);	
		}
		else{
			return this.props.id; //return id of this project
		}
	}*/

	componentWillReceiveProps(nextProps){
		if(nextProps.btnClicked){
			if(!nextProps.updatePublishedFiles && nextProps.updateFiles ){
				//PUBLISHED PROJECT file sblocks edited and saving as a draft
				if(this.props.ascProjectId){
					var query = "project_id="+this.props.ascProjectId;
					this.props.deleteFile(query).then(
						(res) => {
							this.setState({uploadAll: true, btnClicked: true, updateFiles: true, updatePublishedFiles: false});
						},
						(err) => { this.context.router.push('/notfound');}
					);	
				}
			}
			else{
				this.setState({btnClicked: true, updateFiles: nextProps.updateFiles, updatePublishedFiles: nextProps.updatePublishedFiles});
			}
		}
		if(nextProps.files.length >= 0){
			const arrLen = nextProps.files.length;
			this.setState({ currId: this.state.currId+arrLen});
		}
		// if(nextProps.headerImageLink){
        //     fetch('/api/files/file/getUrl?saveLink=' + nextProps.headerImageLink).then( response => response.json()).then(
        //         obj => this.setState({headerImageLink: obj.signedUrl})
        //         )
		// }
		// if(nextProps.heroImage){
        //     fetch('/api/files/file/getUrl?saveLink=' + nextProps.heroImage).then( response => response.json()).then(
        //         obj => this.setState({heroImageLink: obj.signedUrl}))
		// }
	}

	render(){
		var headerLink = this.props.headerImageLink;
        if  (this.state.headerImageLink) {
            headerLink = this.state.headerImageLink;
        }
		var heroLink = this.props.heroImage;
        if (this.state.heroImageLink) {
            heroLink = this.state.heroImageLink;
        }
		var _uploadAll = this.state.uploadAll;
		const oldFilesDisplay = this.props.files.map((fileItem) => {
			return <NewFileBlock key={fileItem.id}  isNewFile={false} btnClicked={this.state.btnClicked} uploadAll={this.state.uploadAll} updateFiles={this.state.updateFiles} file={fileItem}
								ascProjectId={this.props.ascProjectId} updatePublishedFiles={this.state.updatePublishedFiles} existingFileDelete={this.props.deleteClicked} newFileDeleteClicked={this.newFileDeleteClicked} />;
		});
		const newFilesDisplay = this.state.newFilesObjects.map((fileItem) => {
			return <NewFileBlock key={fileItem.id}  uploadAll={this.state.uploadAll} btnClicked={this.state.btnClicked} isNewFile={true} updateFiles={this.state.updateFiles} file={fileItem}
								ascProjectId={this.props.ascProjectId} updatePublishedFiles={this.state.updatePublishedFiles} existingFileDelete={this.props.deleteClicked} newFileDeleteClicked={this.newFileDeleteClicked} />;
		});
		//const headerImg = ( 
		//	<div className="hero-image">
    	//		<img className="img-responsive" src={this.props.heroImage ? this.props.heroImage : this.props.headerImageLink} alt=""/>
    	//	</div>
    	//	);
		
		return(
		<div className="write-page-container"> 
			<div className="container-fluid">
				<div className="row row-left-btn">
					<button className="write-page-btn-back write-page-btn button" onClick={this.backToProfile}> &#60; Back to Projects </button>
				</div>
				<div className="row row-right-btn">
					<button className="write-page-btn-publish write-page-btn button" onClick={this.props.publishClicked}> Publish </button>
					<button className="write-page-btn-draft write-page-btn  button" onClick={this.props.saveDraftClicked}> Save as Draft </button>
				</div>
			</div>	
			<hr className="thick-hr"></hr>
			<div className="container-fluid">
				{ this.props.errors.form && <div className="alert alert-danger"> { this.props.errors.form} </div> }
					<div id="details-write-page" className="hidden-xs">
						<div className="sub-part project-info-bold pull-left">
							<p>Project Info </p>
							<hr/>
						</div>
						<p className="required-text"> All fields marked with * are required. </p>
						<div className="title-abstract-styling">
							<div className="sub-part pull-left title-write">
								<div className="sub-title">
									<h5> TITLE* </h5>
									<InputStyle error={this.props.errors.projectTitle} onChange={this.props.onChange} value={this.props.projectTitle ? this.props.projectTitle : ''} field="projectTitle" />
								</div>
							</div>
							<div className="sub-part pull-left abstract-write">
								<div className="sub-title">
									<h5> ABSTRACT* </h5>
									<div className={classnames('form-group', {'has-error': this.props.errors.projectAbstract})}>
										<textarea type='text' className="abstract-textarea" placeholder="Description" value={this.props.projectAbstract ? this.props.projectAbstract : ''} onChange={this.props.onChange} name="projectAbstract" rows='4'></textarea>
										{this.props.errors.projectAbstract && <span className="help-block">{this.props.errors.projectAbstract}</span> }
									</div>
								</div>
							</div>
						</div>

						<div className="sub-part pull-left">
							<div className="sub-title">
								<h5> VERSION </h5>
								<InputStyle onChange={this.props.onChange} value={this.props.version ? this.props.version : ''} field="version" />
							</div>
						</div>
						<div className="sub-part pull-left">
							<div className="sub-title">
								<h5> AUTHORS* </h5>
								<InputStyle error={this.props.errors.authors} onChange={this.props.onChange} label="Separate by a comma" value={this.props.authors ? this.props.authors.toString() : ''} field="authors" />
							</div>
						</div>
						<div className="sub-part pull-left">
							<div className="sub-title">
								<h5> ASSOCIATED PUBLICATION </h5>
								<InputStyle onChange={this.props.onChange} value={this.props.publication ? this.props.publication : ''} field="publication" />
							</div>
						</div>
						<div className="sub-part pull-left">
							<div className="sub-title">
								<h5> KEYWORDS* </h5>
								<div className={classnames('form-group', {'has-error': this.props.errors.keywords})}>
									<textarea type='text' className="abstract-textarea" placeholder="Separate by a comma" value={this.props.keywords ? this.props.keywords : ''} onChange={this.props.onChange} name="keywords" rows='4'></textarea>
									{this.props.errors.keywords && <span className="help-block">{this.props.errors.keywords}</span> }
								</div>
							</div>
						</div>
						<div className="sub-part pull-left">
							<div className="sub-title">
								<h5> USAGE RIGHTS* <img className="help-icon" src={help} alt="help icon"/> </h5>
								<InputStyle error={this.props.errors.usageRights} onChange={this.props.onChange} value={this.props.usageRights ? this.props.usageRights : ''} field="usageRights" />
							</div>
						</div>
						<div className="sub-part contact-write-style pull-left">
							<div className="sub-title">
								<h5> CONTACT </h5>
								<div className="contact-inputs">
									<InputStyle error={this.props.errors.email} label="Email*"  onChange={this.props.onChange} value={this.props.contactEmail ? this.props.contactEmail: ''} field="contactEmail" />
								</div>
								<div className="contact-inputs">
									<InputStyle label="Homepage" onChange={this.props.onChange} value={this.props.contactHomepage ? this.props.contactHomepage: ''} field="contactHomepage" />
								</div>
								<div className="contact-inputs">
									<InputStyle label="Facebook"  onChange={this.props.onChange} value={this.props.contactFacebook ? this.props.contactFacebook: ''} field="contactFacebook" />
								</div>
								<div className="contact-inputs">
									<InputStyle label="LinkedIn" onChange={this.props.onChange} value={this.props.contactLinkedin ? this.props.contactLinkedin: ''} field="contactLinkedin" />
								</div>
							</div>
						</div>
						<div className="sub-part pull-left">
							<div className="sub-title h-img">
								<h5> COVER IMAGE </h5>
								<hr/>
								<S3Image className="img-responsive project-image" src={headerLink} alt=""/>
								<hr className="sub-title-hr"/>
							</div>
							<div className="content-style-text">
								<button className="upload-input-wrapper ">
								  	<label className="cover-img-upload label">Upload Cover Image</label>
								  	<input onChange={this.handleCoverFileUpload} type="file" accept="image/*" className="cover-file-upload" name="file"/>
								</button>
								<p>Looks best at 200 x 200px jpgs.</p>
							</div>
						</div>
						<div className="sub-part pull-left">
							<div className="sub-title h-img">
								<h5> HERO IMAGE </h5>
								<hr/>
								<S3Image className="img-responsive project-image" src={heroLink} alt=""/>
								<hr className="sub-title-hr"/>
							</div>
							<div className="content-style-text">
								<button className="upload-input-wrapper ">
								  	<label className="cover-img-upload label">Upload Hero Image</label>
								  	<input onChange={this.handleHeroFileUpload} type="file" accept="image/*" className="cover-file-upload" name="file"/>
								</button>
								<p>Looks best at 1000 x 600px jpgs.</p>
							</div>
						</div>
					</div>
				<div id="content-write-page">
					<div className="content-style pull-left">
						<p>Content </p>
						<hr/>
					</div>
					{this.state.oldFilesBlock.length >= 0 ? oldFilesDisplay : '' }
					{this.state.newFilesBlock.length >= 0 ? newFilesDisplay : '' }
					<div className="content-text">
						<p>Add content to project </p>
					</div>
					<div className="content-btns">
						<button className="write-page-content-btn content-btns-style button" onClick={this.textClicked}> Text </button>
						<button className="file-input-wrapper ">
						  	<label className="write-page-content-btn content-btns-style label"> Image</label>
						  	<input onChange={this.handleFileUploads} type="file" accept="image/*" className="input-file-upload" name="file" multiple />
						</button>
						<button className="write-page-content-btn content-btns-style button" onClick={this.videosClicked}> Video </button>
						<button className="file-input-wrapper ">
						  	<label className="write-page-content-btn content-btns-style label"> File</label>
						  	<input onChange={this.handleFileUploads} type="file" accept="application/*, text/*" className="input-file-upload" name="file" multiple />
						</button>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

WritePageUpdate.propTypes={
	onChange: React.PropTypes.func.isRequired,
	publishClicked: React.PropTypes.func.isRequired,
	saveDraftClicked: React.PropTypes.func.isRequired,
	updateFiles: React.PropTypes.bool.isRequired,
	updatePublishedFiles: React.PropTypes.bool.isRequired,
	files: React.PropTypes.array,
	heroImage: React.PropTypes.string,
	authors: React.PropTypes.string,
	version: React.PropTypes.string,
	publication: React.PropTypes.string,
	headerImageLinkOnS3: React.PropTypes.string,
	keywords: React.PropTypes.string,
	usageRights: React.PropTypes.string,
	contactLinkedin: React.PropTypes.string,
	contactFacebook: React.PropTypes.string,
	contactEmail: React.PropTypes.string,
	contactHomepage: React.PropTypes.string,
	projectTitle: React.PropTypes.string,
	projectAbstract: React.PropTypes.string,
	headerImageLink: React.PropTypes.string,
	fileChanged: React.PropTypes.func,
	errors: React.PropTypes.object,
	published: React.PropTypes.bool,
	id: React.PropTypes.number,
	ascProjectId: React.PropTypes.string,
	changePublished: React.PropTypes.func,
	deleteClicked: React.PropTypes.func,
	uploadDocumentToS3: React.PropTypes.func.isRequired,
	signedUrlForS3Doc: React.PropTypes.func.isRequired,
	changeHeaderLink: React.PropTypes.func.isRequired,
	changeHeroLink: React.PropTypes.func.isRequired,
	btnClicked: React.PropTypes.bool,
	deleteFile: React.PropTypes.func.isRequired
}

WritePageUpdate.contextTypes = {
	router: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
	return { auth: state.auth };
}

export default connect(mapStateToProps, {uploadDocumentToS3, deleteFile, signedUrlForS3Doc})(WritePageUpdate);
//<button className="write-page-btn-save write-page-btn button onClick={this.previewClicked}"> Preview </button>
					
