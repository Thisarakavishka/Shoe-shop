package com.helloshoes.shoeshopmanagement.util.ImageUtil;


import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

public class FileUtil {
    public static String saveImageStringToFile(String base64String, String parentFolderPath, String dir, String fileName) {
        String folderPath = parentFolderPath + File.separator + dir;

        if (!createDirectory(parentFolderPath) || !createDirectory(folderPath)) {
            return null;
        }

        byte[] imageBytes = base64StringToArray(base64String);

        if (imageBytes == null) {
            return null;
        }

        String filePath = folderPath + File.separator + fileName;

        if (!writeImageByteToFile(imageBytes, filePath)) {
            return null;
        }
        return filePath;
    }

    private static boolean writeImageByteToFile(byte[] imageBytes, String filePath) {
        try (FileOutputStream fileOutputStream = new FileOutputStream(filePath)) {
            fileOutputStream.write(imageBytes);
            System.out.println("Image successfully saved as: " + filePath);
            return true;
        } catch (IOException e) {
            System.err.println("Error writing image file: " + e.getMessage());
            return false;
        }
    }

    private static byte[] base64StringToArray(String base64String) {
        try {
            return Base64.getDecoder().decode(base64String);
        } catch (IllegalArgumentException e) {
            System.err.println("Error decoding Base64 string: " + e.getMessage());
            return null;
        }
    }

    private static boolean createDirectory(String folderPath) {
        File folder = new File(folderPath);
        if (folder.exists()) {
            return true;
        }
        if (folder.mkdirs()) {
            System.out.println("Folder created: " + folderPath);
            return true;
        } else {
            System.err.println("Error creating folder: " + folderPath);
            return false;
        }
    }

    public static String ecncodImageToBase64String(String path){
        try{
            Path imagePath = Paths.get(path);
            byte[] imageBytes = Files.readAllBytes(imagePath);
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}