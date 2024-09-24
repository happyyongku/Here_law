package org.ssafyb109.here_law.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.ssafyb109.here_law.entity.UserEntity;
import org.ssafyb109.here_law.repository.jpa.UserJpaRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    @Qualifier("userJpaRepository")
    private final UserJpaRepository userJpaRepository;

    // 생성자 주입
    public CustomUserDetailsService(UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userJpaRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // UserEntity를 기반으로 CustomUserDetails 객체 반환
        return new CustomUserDetails(user);
    }
}