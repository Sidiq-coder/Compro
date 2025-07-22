-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'ketua_umum', 'ketua_departemen', 'ketua_divisi', 'sekretaris', 'bendahara', 'pengurus', 'anggota') NOT NULL;
