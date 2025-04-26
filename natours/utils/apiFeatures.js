class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Convert price[lt]=1000 into price: { $lt: 1000 }
    const formattedQuery = {};
    for (const key in queryObj) {
      if (key.includes("[")) {
        const [field, operator] = key.split("[");
        const op = operator.replace("]", ""); // remove the closing bracket
        if (!formattedQuery[field]) formattedQuery[field] = {};
        formattedQuery[field][`$${op}`] = queryObj[key];
      } else {
        formattedQuery[key] = queryObj[key];
      }
    }

    this.query = this.query.find(formattedQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
