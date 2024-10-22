import 'package:flutter/material.dart';
import 'package:sneaker/loginscreen/login_screen.dart';

class WelcomeScreen extends StatefulWidget {
  @override
  _WelcomeScreenState createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    // Tạo Animation Controller
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    // Tạo Animation cho logo
    _animation = Tween<double>(begin: 0, end: 1).animate(_controller)
      ..addListener(() {
        setState(() {});
      });
    // Bắt đầu Animation
    _controller.forward();

    // Chuyển hướng sau 5 giây
    Future.delayed(Duration(seconds: 5), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Màu nền trắng
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Hiệu ứng fade cho logo
            Opacity(
              opacity: _animation.value,
              child: Image.asset(
                'assets/img_logo/modern-sneaker-shoe-logo-vector.jpg',
                width: 150,
                height: 150,
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Tên Ứng Dụng', // Thay thế bằng tên ứng dụng của bạn
              style: TextStyle(
                fontSize: 30, // Tăng kích thước chữ
                fontWeight: FontWeight.bold,
                color: Colors.black87, // Màu chữ
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Chào mừng bạn đến với ứng dụng của chúng tôi!',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600], // Màu chữ nhạt hơn
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 30),
            CircularProgressIndicator(), // Hiển thị vòng tròn loading
          ],
        ),
      ),
    );
  }
}
