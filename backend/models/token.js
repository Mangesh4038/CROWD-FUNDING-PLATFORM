const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	token: { type: String, required: true },
	// emailCode: { type: String, required: true }, // Added emailCode field
	createdAt: { type: Date, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model("Token", tokenSchema);
