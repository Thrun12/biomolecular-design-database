import React from 'react';

class Footer extends React.Component {
	render (){
		return(
			<div className="container-fluid">
				<hr/>
				<div className="row">
					<div className="col-xs-12 paddingBottom">
						<p>
							&copy; 2017 &middot;
							<a href="https://international.au.dk/about/profile/privacy-policy/">Privacy policy</a>
							&middot;
							<a href="https://international.au.dk/about/profile/cookies-policy/">Cookie policy</a>
						</p>
					</div>
				</div>

			</div>
		);
	}
}


export default Footer;
