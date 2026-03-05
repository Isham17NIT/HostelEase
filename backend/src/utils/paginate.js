export async function paginate(Model, query, sortOptions, page=1, limit=10){
    
    const skip = (page-1)*limit;

    const results = await Model.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)

    const total = await Model.countDocuments(query);

    return {results,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total
    }
}