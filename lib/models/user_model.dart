class UserModel {
  final String id;
  final String username;
  final String password;
  final String email;
  final String? img; // Thêm trường img (có thể null)

  UserModel({
    required this.id,
    required this.username,
    required this.password,
    required this.email,
    this.img, // img là tuỳ chọn
  });

  // Tạo từ Map
  factory UserModel.fromMap(Map<String, dynamic> data) {
    return UserModel(
      id: data['_id'],
      username: data['username'],
      password: data['password'],
      email: data['email'],
      img: data['img'], // Nhận giá trị img từ Map
    );
  }

  // Chuyển đổi thành Map
  Map<String, dynamic> toMap() {
    return {
      '_id': id,
      'username': username,
      'password': password,
      'email': email,
      'img': img, // Thêm img vào Map
    };
  }
}
