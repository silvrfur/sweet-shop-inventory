import api from "@/lib/api";

export async function getProducts() {
  const response = await api.get("/products");
  return response.data;
}

export async function addProduct(productData) {
  const response = await api.post("/products", productData);
  return response.data;
}

export async function purchaseProduct(id, quantity) {
  const response = await api.post(`/products/${id}/purchase`, { quantity });
  return response.data;
}

export async function restockProduct(id, quantity) {
  const response = await api.post(`/products/${id}/restock`, { quantity });
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
