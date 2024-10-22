import 'package:flutter/material.dart';
import 'package:sneaker/service/auth_service%20.dart';

class ForgotPasswordScreen extends StatefulWidget {
  @override
  _ForgotPasswordScreenState createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  final AuthService _authService = AuthService();

  void _forgotPassword() async {
    try {
      await _authService.forgotPassword(_emailController.text);
      // Hiển thị thông báo thành công
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.')),
      );
      Navigator.pop(context); // Quay lại trang trước đó
    } catch (e) {
      // Hiển thị thông báo lỗi
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Có lỗi xảy ra')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Quên Mật Khẩu')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            ElevatedButton(
              onPressed: _forgotPassword,
              child: Text('Gửi yêu cầu đặt lại mật khẩu'),
            ),
          ],
        ),
      ),
    );
  }
}
