var Button = app.ReactBootstrap.Button;
var Col = app.ReactBootstrap.Col;
var ControlLabel = app.ReactBootstrap.ControlLabel;
var Form = app.ReactBootstrap.Form;
var FormControl = app.ReactBootstrap.FormControl;
var FormGroup = app.ReactBootstrap.FormGroup;
var Modal = app.ReactBootstrap.Modal;
var OverlayTrigger = app.ReactBootstrap.OverlayTrigger;
var Tooltip = app.ReactBootstrap.Tooltip;

var BrandModal = React.createClass({

  propTypes: {
    brand: React.PropTypes.object,
    notifyParent: React.PropTypes.func,
    create: React.PropTypes.bool
  },

  close: function() { this.setState({ showModal: false })},
  
  create: function() {
    $.ajax({
      method: 'post',
      url: app.getUrl(location, 'brand'), 
      data: this.state.updatedFields,
      dataType: 'json',
      statusCode: {
        201: function(data) {
                this.props.notifyParent(data.links[0].href);
                this.close();
              }.bind(this)
      }});
  },

  componentWillMount: function() {

  },

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
          {
            this.props.create ? '+' : 'Edit Properties'
          }
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              {
                function() {
                  if (this.props.create) {
                    return 'Create a Brand';
                  } else {
                    return 'Edit Properties: ' + this.props.brand.name;
                  }                  
                }.bind(this)()
              }
            </Modal.Title>
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
                    placeholder={
                      function() {
                        if (this.props.create) {
                          return 'e.g. Super Foods';
                        } else {                      
                          return this.props.brand.name;
                        }
                      }.bind(this)()
                    }
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
                onClick={
                  function() {
                    return this.props.create ? this.create : this.save;
                  }.bind(this)()
                }
                bsStyle="success"
              >Save</Button>
              {
                function() {
                  if (!this.props.create) {
                    return(
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="modal-tooltip">
                            You <strong>cannot</strong> undo this.
                          </Tooltip>
                        }
                        placement="top"
                      >
                        <Button
                          onClick={this.delete}
                          bsStyle="danger"
                        >Delete</Button>
                      </OverlayTrigger>                    
                    );
                  }
                }.bind(this)()
              }
            </Modal.Footer>
          </Form>
        </Modal>
        </div>
      );    
  },

  save: function() {
    $.ajax({
      method: 'put',
      url: this.props.brand.links[0].href,
      data: this.state.updatedFields
    });

    this.props.notifyParent();
    this.close();
  },

  updateNameField: function(e) {
    this.state.updatedFields.name = e.target.value;
  }
});
