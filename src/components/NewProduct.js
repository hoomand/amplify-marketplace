import React from "react";
import { Storage, Auth, API, graphqlOperation } from "aws-amplify";
import { PhotoPicker } from "aws-amplify-react";
import aws_exports from "../aws-exports";
import { convertDollarsToCents } from "../utils";
import { createProduct } from "../graphql/mutations";
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";

const initialState = {
  description: "",
  price: "",
  shipped: false,
  imagePreview: "",
  image: "",
  isUploading: false,
};

class NewProduct extends React.Component {
  state = {
    ...initialState,
  };

  handleAddProduct = async () => {
    try {
      this.setState({ isUploading: true });
      const visibility = "public";
      const {
        attributes: { sub: owner },
      } = await Auth.currentUserInfo();
      const { identityId } = await Auth.currentCredentials();
      const filename = `/${visibility}/${identityId}/${Date.now()}-${
        this.state.image.name
      }`;
      const uploadedFile = await Storage.put(filename, this.state.image.file, {
        contentType: this.state.image.type,
      });

      const S3File = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_user_files_s3_bucket_region,
      };

      const input = {
        productMarketId: this.props.marketId,
        description: this.state.description,
        shipped: this.state.shipped,
        price: convertDollarsToCents(this.state.price),
        owner,
        file: S3File,
      };

      const result = await API.graphql(
        graphqlOperation(createProduct, { input })
      );
      console.log(result);
      Notification({
        title: "Success",
        message: "Product successfully created!",
        type: "success",
      });

      this.setState({ ...initialState });
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  render() {
    const {
      description,
      price,
      image,
      shipped,
      imagePreview,
      isUploading,
    } = this.state;

    return (
      <div className="flex-center">
        <h2 className="header">
          <div>
            <Form className="market-header">
              <Form.Item label="Add Product Description">
                <Input
                  type="text"
                  icon="information"
                  placeholder="Description"
                  value={description}
                  onChange={(description) => this.setState({ description })}
                />
              </Form.Item>
              <Form.Item label="Set Product Price">
                <Input
                  type="number"
                  icon="plus"
                  placeholder="Price $(USD)"
                  value={price}
                  onChange={(price) => this.setState({ price })}
                />
              </Form.Item>
              <Form.Item label="Is the product shipped or emailed to the customer?">
                <div className="text-center">
                  <Radio
                    value="true"
                    checked={shipped === true}
                    onChange={() => this.setState({ shipped: true })}
                  >
                    Shipped
                  </Radio>
                  <Radio
                    value="false"
                    checked={shipped === false}
                    onChange={() => this.setState({ shipped: false })}
                  >
                    Emailed
                  </Radio>
                </div>
              </Form.Item>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="image-preview"
                />
              )}
              <PhotoPicker
                headerText="Product Image"
                onPick={(file) => this.setState({ image: file })}
                preview="hidden"
                onLoad={(url) => this.setState({ imagePreview: url })}
                theme={{
                  formContainer: {
                    margin: 0,
                    padding: "0.8em",
                  },
                  formSection: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  sectionBody: {
                    margin: 0,
                    width: "250px",
                  },
                  sectionHeader: {
                    padding: "0.2em",
                    color: "var(--darkAmazonOrange)",
                  },
                  // photoPickerButton:{
                  //   display: 'none',
                  // }
                }}
              />
              <Form.Item>
                <Button
                  disabled={!image || !description || !price || isUploading}
                  type="primary"
                  loading={isUploading}
                  onClick={this.handleAddProduct}
                >
                  {isUploading ? "Uploading..." : "Add Product"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </h2>
      </div>
    );
  }
}

export default NewProduct;
