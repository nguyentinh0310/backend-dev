class APIfeatures {
  public query: any;
  public queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query; // schema.find()
    this.queryString = queryString; // req.query
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 15;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }

  sorting() {
    const sort = this.queryString.sort || "-createdAt";
    this.query = this.query.sort(sort);
    return this;
  }

  searching() {
    let search = this.queryString.search;
    search = new RegExp(search, "i");
    if (search) {
      this.query = this.query.find({
        $text: { $search: search },
      });
    } else {
      this.query = this.query.find();
    }
    return this;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

export default APIfeatures;
