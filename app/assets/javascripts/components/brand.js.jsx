var Brand = React.createClass({
  propTypes: {
    resource: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      brand: {}  
    };
  },

  loadBrand: function(resource) {
    var that = this;
    $.ajax(resource, {
      success: function(data) {
        that.setState({ brand: data });
      }
    });
  },

  componentDidUpdate: function() {
    this.loadBrand(this.props.resource);
  },

  componentWillReceiveProps: function(nextProps) {
    this.loadBrand(nextProps.resource);
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.state.brand.name}</h3>
        </div>
        <div className="panel-body">
        <strong>Resource: </strong>{this.state.brand.links[0].href}
        <br />
        <a href="#" className="btn btn-primary">Edit</a>
        </div>
      </div>
    );
  }
});
