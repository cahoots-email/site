var App = React.createClass({
  render: function() {
    return(
      <div>
        <div id="left">
          <SliderContainer />
        </div>
        <div id="right">
          <h3>Collaborators</h3>
          <CollaboratorBox url="" pollInterval={2000}/>
        </div>
        <div id="right-right">
          <h3>Editable Drafts</h3>
          <DraftBox url="" pollInterval={2000}/>
        </div>
      </div>
    );
  }
});

var SliderContainer = React.createClass({
  getInitialState:function(){
    return {
      draftNum:1
    }
  },
  update:function(){
    // TODO: refresh page with new draft #
    var index = this.refs.draftNum.refs.range.getDOMNode().value;
    var dboxrefs = this.refs.curDraftBox.refs;
    var dboxstate = this.refs.curDraftBox.state;
    // dboxrefs.curEdit.getDOMNode().value = dboxstate.edits[index - 1].text;
    // dboxrefs.recentEdit.getDOMNode().value = "Edit by " + dboxstate.edits[index - 1].email;
    $("#" + dboxrefs.curEdit.getDOMNode().id).animate({opacity:0},function(){
      $(this).text(dboxstate.edits[index - 1].text).animate({opacity:1});  
    })

    $("#" + dboxrefs.recentEdit.getDOMNode().id).animate({opacity:0},function(){
      $(this).text("Edit by " + dboxstate.edits[index - 1].email).animate({opacity:1});  
    })

    
    dboxstate.curEdit = dboxstate.edits[index - 1];
    this.setState({
      draftNum:index
    });
    this.refs.draftNum.refs.range.getDOMNode().max = dboxstate.edits.length;
  },
  render:function(){
    return (
      <div className="sliderContainer">
        <Slider ref="draftNum" update={this.update} />
        <CurDraftBox ref="curDraftBox" update={this.update} />
      </div>
    )
  }
});

var Slider = React.createClass({
    render:function(){
      var max = 5;
      return (
        <div className="slider">
          <input 
            className="slider"
            ref="range"
            type="range"
            min="1"
            max={max}
            value = {this.props.draftNum}
            step = "1"
            onChange={this.props.update} />
          </div>
      )
    }
});

var CurDraftBox = React.createClass({
  getInitialState: function() {
    var edits = [ {text: "body of email1", 
               email: "chelpu@umich.edu"},
               {text: "body of email2", 
               email: "hha@umich.edu"},
               {text: "body of email3", 
               email: "yolo@umich.edu"},
               {text: "body of email4", 
               email: "special@umich.edu"},
               {text: "body of email5", 
               email: "endpoint@umich.edu"}
              ];
    // TODO: GET real current edit from db
    return { edits: edits, curEdit: edits[edits.length - 1]};
  },
  updateEditToIndex: function(index) {
      this.setState({
        curEdit: edits[index - 1]
      });
  },
  handleSubmit: function(event) {
    // TO-DO: send changes to db, update frontend, POST text to edits endpoint
    this.setState({newEdit: event.target.curEdit, curEdit: event.target.curEdit});
  },
  handleOtherSubmit: function(event) {
    $.get("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC", function( data ) {
      $('#left').css('background', 'url('+ data["data"]["fixed_height_downsampled_url"] + ')');
    });
    return false;
  },
  handleChange: function(event) {
                        console.log(this.props.draftNum);
    this.setState({newEdit: event.target.newEdit});
  },
  render: function() {
    // TODO: GET value from drafts
    var curEdit = this.state.curEdit; 
    return (
      <div className="draftBox">
        <h3 id="recentEdit" ref="recentEdit">Edit by {this.state.curEdit.email}</h3>
        <textarea ref="curEdit" id="draftText" readonly disabled>{this.state.edits[this.state.edits.length - 1].text}</textarea>
        <textarea ref="newEdit" name="newEdit" id="editBox" form="draftForm">{this.state.edits[this.state.edits.length - 1].text}</textarea>
        <form id="draftForm" onSubmit={this.handleSubmit}>
          <input id="submitDraft" type="submit" value="Submit Edit" />
        </form>
        <form id="crazy" onSubmit={this.handleOtherSubmit}>
          <input id="getCrazy" type="submit" value="Get Gifs" />
        </form>
      </div>
    );
  }
});

var CollaboratorBox = React.createClass({
  getCollaborators: function() {
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   success: function(data) {
    //     this.setState({data: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
    this.setState({data: [{email: "yoyoma@umich.edu"}, 
                          {email: "madonnasdaughter@umich.edu"}] 
                  });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.getCollaborators();
    setInterval(this.getCollaborators, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="collabBox">
        <CollaboratorList data={this.state.data} />
        <CollaboratorForm />
      </div>
    );
  }
});

var CollaboratorForm = React.createClass({
  handleSubmit: function(event) {
    // TO-DO: send changes to db, POST text to edits endpoint

  },
  render: function() {
    return (
      <div className="collabForm">
        <form id="collabForm" onSubmit={this.handleSubmit}>
          <input id="addEmail" type="text" /><br/>
          <input id="submitEmail" type="submit" value="Add Collaborator" />
        </form>
      </div>
    );
  }
});

var CollaboratorList = React.createClass({
  render: function() {
    var collabNodes = this.props.data.map(function (c) {
      return (
        <Collaborator id={c.email}></Collaborator>
      );
    });
    return (
      <div className="collabList">
        {collabNodes}
      </div>
    );
  }
});

var Collaborator = React.createClass({
  render: function() {
    return (
      <p className="collabId">
        {this.props.id}
      </p>
    );
  }
});

var DraftBox = React.createClass({
  getDrafts: function() {
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   success: function(data) {
    //     this.setState({data: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
    this.setState({data: [{id: "yoyoyo", text: "kajsdflkajsdkakjfjf"}, {id: "hahaha", text: "jfjdkfjkajfjjfkdkdjfgk"}] });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.getDrafts();
    setInterval(this.getDrafts, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="draftBox">
        <DraftList data={this.state.data} />
      </div>
    );
  }
});

var DraftList = React.createClass({
  render: function() {
    var draftNodes = this.props.data.map(function (draft) {
      return (
        <Draft id={draft.id}></Draft>
      );
    });
    return (
      <div className="draftList">
        {draftNodes}
      </div>
    );
  }
});

var Draft = React.createClass({
  render: function() {
    var url = "";

    return (
      <div className="draft">
        <a className="draftId" href={url}>
          {this.props.id}
        </a>
      </div>
    );
  }
});

React.render(
  <App />,
  document.body
);