import React from 'react';
import '../../styles/footer.css';

const Footer = () => {
        return (
            <footer id="footer" className="page-footer mt-4">© Blog Project {new Date().getFullYear()}</footer>
        );
}

export default Footer;