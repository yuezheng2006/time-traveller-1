import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('--- Supabase Connection Test ---');
  console.log('URL:', supabaseUrl);
  console.log('Service Role Key:', supabaseServiceRoleKey ? 'PRESENT (starts with ' + supabaseServiceRoleKey.substring(0, 10) + '...)' : 'MISSING');

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // 1. 测试数据库连接 (查询之前创建的表)
    console.log('\n1. Testing Database connection...');
    const { data: tableData, error: tableError } = await supabase
      .from('teleport_history')
      .select('count', { count: 'exact', head: true });

    if (tableError) {
      console.error('Database Error:', tableError.message);
    } else {
      console.log('✅ Database connection successful! Found teleport_history table.');
    }

    // 2. 测试存储桶连接
    console.log('\n2. Testing Storage connection...');
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('time-traveller-images');

    if (bucketError) {
      console.error('Storage Error:', bucketError.message);
    } else {
      console.log(`✅ Storage connection successful! Bucket "${bucketData.name}" is accessible.`);
    }

    // 3. 测试 Auth 设置 (获取项目配置)
    console.log('\n3. Testing Auth configuration...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1
    });

    if (authError) {
      console.error('Auth Admin Error:', authError.message);
    } else {
      console.log('✅ Auth Admin connection successful! Can access user list.');
    }

    console.log('\n--- All Tests Completed ---');
  } catch (err) {
    console.error('\n❌ Unexpected error during testing:', err);
  }
}

testSupabaseConnection();
