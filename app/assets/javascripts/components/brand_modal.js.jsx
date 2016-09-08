var Button = app.ReactBootstrap.Button;
var Modal = app.ReactBootstrap.Modal;
var OverlayTrigger = app.ReactBootstrap.OverlayTrigger;
var Form = app.ReactBootstrap.Form;
var FormGroup = app.ReactBootstrap.FormGroup;
var FormControl = app.ReactBootstrap.FormControl;

var Col = app.ReactBootstrap.Col;
var ControlLabel = app.ReactBootstrap.ControlLabel;

var BrandModal = React.createClass({

  propTypes: {
    brand: React.PropTypes.object,
    notifyParent: React.PropTypes.func
  },

  close: function() { this.setState({ showModal: false })},
  delete: function() {
    $.ajax({
      method: 'delete',
      url: this.props.brand.links[0].href
    });

    this.props.notifyParent();
    this.close();
  },

  getInitialState: function() {
    return {
      showModal: false,
      updatedFields: {}
    };
  },

  open: function() { this.setState({ showModal: true })},

  render: function() {
      return(
        <div>
        <Button
          className="btn-block"
          bsStyle="primary"
          bsSize="sm"
          onClick={this.open}
        >
          View/Edit
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>View/Edit {this.props.brand.name}</Modal.Title>
          </Modal.Header>

          <Form horizontal>
            <Modal.Body>
              <FormGroup controlId="brandName">
                <Col componentClass={ControlLabel} sm={1}>
                  Name
                </Col>
                <Col smOffset={7} sm={4}>
                  <FormControl 
                    type="text"
                    placeholder={this.props.brand.name} 
                    onChange={this.updateNameField}
                  />
                </Col>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={this.close}
                bsStyle="default"
              >Close</Button>
              <Button
                onClick={this.save}
                bsStyle="success"
                type="submit"
              >Save</Button>
              <Button
                onClick={this.delete}
                bsStyle="danger"
              >Delete</Button>
            </Modal.Footer>
          </Form>
        </Modal>
        </div>
      );    
  },

  save: function() {
    var onSuccess = function(data) {
      this.props.notifyParent();
      this.close();
    }.bind(this);

    $.ajax(
      {
        method: 'put',
        url: this.props.brand.links[0].href,
        data: this.state.updatedFields
      }, {
        success: onSuccess
      }
    );
  },

  updateNameField: function(e) {
    this.state.updatedFields.name = e.target.value;
  }
});
