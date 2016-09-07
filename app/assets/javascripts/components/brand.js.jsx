var Brand = React.createClass({
  propTypes: {
    resource: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      brand: undefined
    };
  },

  loadBrand: function(resource) {
    var onSuccess = function(data) {
      this.setState({brand: data});
    }.bind(this);

    $.ajax(resource, {
      success: onSuccess
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.loadBrand(nextProps.resource);
  },

  componentWillMount: function() {
    this.loadBrand(this.props.resource);
  },

  render: function() {
    if (this.state.brand === undefined) {
      return(<div></div>);
    }
    else {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">{this.state.brand.name}</h3>
          </div>
          <div className="panel-body">
            <table className="table table-condensed table-responsive table-bordered table-striped">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.brand.links[0].href}</td>
                  <td>
                    <a href="#" className="btn btn-primary btn-sm">Edit</a>                
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
});
