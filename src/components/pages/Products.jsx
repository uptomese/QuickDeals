import React, { useState, useEffect } from "react";
import Nav from "../Nav.jsx";
import axios from "axios";
import DataTable from "react-data-table-component";

function Products() {
  const [product, setProduct] = useState({
    img: "",
    name: "",
    description: "",
    price: 0,
    user_id: 0,
  });

  const [data, setData] = useState(null);

  const [mode, setMode] = useState({
    btn: "Create",
    status: "insert",
    id: 0,
  });

  useEffect(() => {
    // Make a GET request when the component mounts
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (mode.status === "insert") {
      axios
        .post("http://localhost:3000/api/products", product)
        .then((response) => {
          if (response.data.status) {
            setProduct({
              img: "",
              name: "",
              description: "",
              price: 0,
              user_id: 0,
            });
            setData([...data, response.data.data]);
          } else {
            alert("Cant save to db");
          }
        })
        .catch((error) => {
          console.error("Error creating products:", error);
        });
    } else {
      axios
        .put(`http://localhost:3000/api/products/${mode.id}`, product)
        .then((response) => {
          if (response.data.status) {
            setProduct({
              img: "",
              name: "",
              description: "",
              price: 0,
              user_id: 0,
            });
            setData((prevData) =>
              prevData.map((item) =>
                item.id * 1 === response.data.data.id * 1
                  ? response.data.data
                  : item
              )
            );
            setMode({
              btn: "Create",
              status: "insert",
              id: 0,
            });
          } else {
            alert("Cant update to db");
          }
        })
        .catch((error) => {
          console.error("Error update products:", error);
        });
    }
  };

  const handleOnDelete = (id) => {
    axios
      .delete(`http://localhost:3000/api/products/${id}`)
      .then((response) => {
        if (response.data.status) {
          // If the delete operation was successful, update the state to remove the deleted product from the data array
          setData(data.filter((item) => item.id !== id));
        } else {
          alert("Product not found");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const handleOnEdit = (id) => {
    axios
      .get(`http://localhost:3000/api/products/${id})`)
      .then((response) => {
        setProduct({
          img: response.data[0].img,
          name: response.data[0].name,
          description: response.data[0].description,
          price: response.data[0].price,
          user_id: response.data[0].user_id,
        });
        setMode({
          btn: "Update",
          status: "update",
          id: id * 1,
        });
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleOnCancel = () => {
    setMode({
      btn: "Create",
      status: "insert",
      id: 0,
    });
    clearProduct();
  };

  const clearProduct = () => {
    setProduct({
      img: "",
      name: "",
      description: "",
      price: 0,
      user_id: 0,
    });
  };

  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => {
        return (
            <div className="avatar">
                <div className="w-24 mask mask-squircle">
                    <img src={row.img} />
                </div>
            </div>
        );
      },
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="btn-group">
            <button
              className="btn btn-primary"
              onClick={() => handleOnEdit(row.id)}
            >
              edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleOnDelete(row.id)}
            >
              delete
            </button>
          </div>
        );
      },
      sortable: true,
    },
  ];

  return (
    <>
      <Nav />
      <div>Products</div>
      <form action="" onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="Img"
          className="input input-bordered w-full max-w-xs"
          value={product.img}
          onChange={(e) => setProduct({ ...product, img: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered w-full max-w-xs"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered w-full max-w-xs"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          className="input input-bordered w-full max-w-xs"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="User_id"
          className="input input-bordered w-full max-w-xs"
          value={product.user_id}
          onChange={(e) => setProduct({ ...product, user_id: e.target.value })}
        />
        <button className="btn btn-secondary" type="submit">
          {mode.btn}
        </button>
        {mode.btn !== "Create" && (
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => handleOnCancel()}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="overflow-x-auto">
        <h2>Product List</h2>
        {data !== null && data.length > 0 ? (
          <DataTable
            columns={columns}
            data={data}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            pagination
          />
        ) : (
          <p>Loading...</p>
        )}
        {/* <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>img</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>User</th>
              <th>Created at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data !== null && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.img}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.user_id}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOnEdit(item.id)}
                      >
                        edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleOnDelete(item.id)}
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
          </tbody>
        </table> */}
      </div>
    </>
  );
}

export default Products;
