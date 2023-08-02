package com.userManagement.services;

import com.commons.entities.User;
import com.commons.entities.Verification;
import com.userManagement.dao.UserDao;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class EmailVerifier {
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    private final JavaMailSender javaMailSender;
    private final UserDao userDao;
    @Value("${email-address}")
    private String EMAIL_ADDRESS;
    private final String VERIFICATION_PREFIX = "http://localhost:8080/user/verify?token=";
    @Autowired
    public EmailVerifier(JavaMailSender javaMailSender, UserDao userDao) {
        this.javaMailSender = javaMailSender;
        this.userDao = userDao;
    }

    public void sendVerificationEmail(String recipientEmail, String verificationToken){
        executorService.submit(() -> {
            try{
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setFrom(EMAIL_ADDRESS);
                helper.setTo(recipientEmail);
                helper.setSubject("Verification For your account for LetsChat");
                helper.setText(VERIFICATION_PREFIX+verificationToken);
                javaMailSender.send(message);
            } catch (Exception e){
                System.out.println(Arrays.toString(e.getStackTrace()));
            }

        });
    }

    public boolean verifyEmail(String verificationCode){
        Verification verification = userDao.getVerificationByCode(verificationCode);
        if (verification == null){
            return false;
        }
        Timestamp timestamp = verification.getTimestamp();
        Timestamp cur = new Timestamp(System.currentTimeMillis());
        long timeDifferenceMillis = cur.getTime() - timestamp.getTime();
        // Convert the time difference to minutes
        long timeDifferenceMinutes = Math.abs(timeDifferenceMillis / (60 * 1000));
        if (timeDifferenceMinutes>10){
            return false;
        }
        String email = verification.getEmail();
        userDao.updateVerified(email);
        return true;
    }
}
