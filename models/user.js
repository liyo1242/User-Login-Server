const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs'); //

//Define the model format
const userSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	password: String
});

// on save hook, encrypt password
// before saving a model, run this function
userSchema.pre('save', function(next) {
	// get access to the user model
	const user = this;

	// generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);

		//hash password by using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);

			// overwrite
			user.password = hash;
			next(); // SAVE
		})
	})
})

// this Custom method is for passport strategy #2
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	// Bcrypt can only be encrypted one way! Can't decrypt in reverse!!!!!!!
	// this.password 為已經被加密的
	// 比對方法為從this.password得到之前加密的salt和Round和Hash, 之後再對candidatePassword做一次加密, 在跟Hash比對
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);

		callback(null, isMatch);
	})
}

// 加密後的 bcrypt 分為四個部分：

// Bcrypt
// 該字串為 UTF-8 編碼，並且包含一個終止符
// Round
// (回合數)每增加一次就加倍雜湊次數，預設10次
// Salt
// (加鹽)128 bits 22個字元
// Hash
// (雜湊)138 bits 31個字元

//Create the model class
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;